import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { BaseController } from '../common'
import {
  AuthBearerMiddlewareGuard,
  AuthUserMiddleware,
  OwnerCommentMiddlewareGuard,
  ValidateBodyMiddleware,
  ValidateParamsMiddleware,
} from '../middlewares'
import { TYPES } from '../types'
import { CommentsService } from './comments.service'
import { BaseCommentDto, BaseCommentLikeDto, CommentExist } from './dto'

@injectable()
class CommentsController extends BaseController {
  constructor(
    @inject(TYPES.CommentsService)
    private readonly commentsService: CommentsService,
    @inject(TYPES.AuthUserMiddleware)
    private readonly authUserMiddleware: AuthUserMiddleware,
    @inject(TYPES.AuthBearerMiddlewareGuard)
    private readonly authBearerMiddlewareGuard: AuthBearerMiddlewareGuard
  ) {
    super()
    this.bindRoutes({
      path: '/:id/like-status',
      method: 'put',
      func: this.updateLikeById,
      middlewares: [
        this.authBearerMiddlewareGuard,
        new ValidateBodyMiddleware(BaseCommentLikeDto),
        new ValidateParamsMiddleware(CommentExist),
      ],
    })
    this.bindRoutes({
      path: '/:id',
      method: 'put',
      func: this.updateById,
      middlewares: [
        this.authBearerMiddlewareGuard,
        new ValidateBodyMiddleware(BaseCommentDto),
        new ValidateParamsMiddleware(CommentExist),
        new OwnerCommentMiddlewareGuard(this.commentsService),
      ],
    })
    this.bindRoutes({
      path: '/:id',
      method: 'delete',
      func: this.deleteById,
      middlewares: [
        this.authBearerMiddlewareGuard,
        new ValidateParamsMiddleware(CommentExist),
        new OwnerCommentMiddlewareGuard(this.commentsService),
      ],
    })
    this.bindRoutes({
      path: '/:id',
      method: 'get',
      func: this.getById,
      middlewares: [
        new ValidateParamsMiddleware(CommentExist),
        this.authUserMiddleware,
      ],
    })
  }

  private async getById(
    { params, context }: Request<CommentExist>,
    res: Response
  ) {
    const { id } = params

    const result = await this.commentsService.getById({
      id,
      userId: context?.user.id,
    })

    res.status(200).json(result)
  }

  private async updateLikeById(
    req: Request<CommentExist, {}, BaseCommentLikeDto>,
    res: Response
  ) {
    const {
      body: { likeStatus },
      params: { id },
      context: { user },
    } = req

    await this.commentsService.updateLikeById({
      commentId: id,
      userId: user.id,
      likeStatus,
    })

    res.sendStatus(204)
  }

  private async updateById(
    req: Request<CommentExist, {}, BaseCommentDto>,
    res: Response
  ) {
    const {
      params: { id },
      body: { content },
    } = req

    await this.commentsService.updateById({ id, content })

    res.sendStatus(204)
  }

  private async deleteById({ params }: Request<CommentExist>, res: Response) {
    const { id } = params

    await this.commentsService.deleteById(id)

    res.sendStatus(204)
  }
}

export { CommentsController }
