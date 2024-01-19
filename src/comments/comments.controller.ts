import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { BaseController } from '../common'
import {
  AuthBearerMiddlewareGuard,
  OwnerCommentMiddlewareGuard,
  ValidateBodyMiddleware,
  ValidateParamsMiddleware,
} from '../middlewares'
import { TYPES } from '../types'
import { CommentsService } from './comments.service'
import { CommentExist } from './dto/params'
import { BaseCommentDto } from './dto'

@injectable()
class CommentsController extends BaseController {
  constructor(
    @inject(TYPES.CommentsService)
    private readonly commentsService: CommentsService,
    @inject(TYPES.AuthBearerMiddlewareGuard)
    private readonly authBearerMiddlewareGuard: AuthBearerMiddlewareGuard
  ) {
    super()
    this.bindRoutes({
      path: '/:id',
      method: 'get',
      func: this.getById,
      middlewares: [new ValidateParamsMiddleware(CommentExist)],
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
  }

  private getById = async (
    { params }: Request<CommentExist>,
    res: Response
  ) => {
    const { id } = params

    const result = await this.commentsService.getById(id)

    res.status(200).json(result)
  }

  private updateById = async (
    { params, body }: Request<CommentExist, {}, BaseCommentDto>,
    res: Response
  ) => {
    const { id } = params
    const { content } = body

    await this.commentsService.updateById({ id, content })

    res.sendStatus(204)
  }

  private deleteById = async (
    { params }: Request<CommentExist>,
    res: Response
  ) => {
    const { id } = params

    await this.commentsService.deleteById(id)

    res.sendStatus(204)
  }
}

export { CommentsController }
