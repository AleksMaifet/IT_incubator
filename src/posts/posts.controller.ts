import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { BaseController } from '../common'
import {
  AuthBasicMiddlewareGuard,
  AuthBearerMiddlewareGuard,
  ValidateBodyMiddleware,
  ValidateParamsMiddleware,
} from '../middlewares'
import {
  BaseCommentDto,
  CommentsService,
  GetCommentsRequestQuery,
} from '../comments'
import { TYPES } from '../types'
import { CreatePostDto, UpdatePostDto, PostExist } from './dto'
import { PostsService } from './posts.service'
import { GetPostsRequestQuery } from './interfaces'

@injectable()
class PostsController extends BaseController {
  constructor(
    @inject(TYPES.PostsService)
    private readonly postsService: PostsService,
    @inject(TYPES.CommentsService)
    private readonly commentsService: CommentsService,
    @inject(TYPES.AuthBasicMiddlewareGuard)
    private readonly authBasicMiddlewareGuard: AuthBasicMiddlewareGuard,
    @inject(TYPES.AuthBearerMiddlewareGuard)
    private readonly authBearerMiddlewareGuard: AuthBearerMiddlewareGuard
  ) {
    super()
    this.bindRoutes({ path: '/', method: 'get', func: this.getAll })
    this.bindRoutes({
      path: '/:id',
      method: 'get',
      func: this.getById,
      middlewares: [new ValidateParamsMiddleware(PostExist)],
    })
    this.bindRoutes({
      path: '',
      method: 'post',
      func: this.create,
      middlewares: [
        this.authBasicMiddlewareGuard,
        new ValidateBodyMiddleware(CreatePostDto),
      ],
    })
    this.bindRoutes({
      path: '/:id',
      method: 'put',
      func: this.updateById,
      middlewares: [
        this.authBasicMiddlewareGuard,
        new ValidateParamsMiddleware(PostExist),
        new ValidateBodyMiddleware(UpdatePostDto),
      ],
    })
    this.bindRoutes({
      path: '/:id',
      method: 'delete',
      func: this.deleteById,
      middlewares: [
        this.authBasicMiddlewareGuard,
        new ValidateParamsMiddleware(PostExist),
      ],
    })
    this.bindRoutes({
      path: '/:id/comments',
      method: 'get',
      func: this.getAllCommentById,
      middlewares: [new ValidateParamsMiddleware(PostExist)],
    })
    this.bindRoutes({
      path: '/:id/comments',
      method: 'post',
      func: this.createCommentById,
      middlewares: [
        this.authBearerMiddlewareGuard,
        new ValidateParamsMiddleware(PostExist),
        new ValidateBodyMiddleware(BaseCommentDto),
      ],
    })
  }

  private async getAll(
    req: Request<{}, {}, {}, GetPostsRequestQuery<string>>,
    res: Response
  ) {
    const { query } = req

    const result = await this.postsService.getAll(query)

    res.status(200).json(result)
  }

  private async getById({ params }: Request<PostExist>, res: Response) {
    const { id } = params

    const result = await this.postsService.getById(id)

    res.status(200).json(result)
  }

  private async create(
    { body }: Request<{}, {}, CreatePostDto>,
    res: Response
  ) {
    const result = await this.postsService.create(body)

    res.status(201).json(result)
  }

  private async updateById(
    { params, body }: Request<PostExist, {}, UpdatePostDto>,
    res: Response
  ) {
    const { id } = params

    await this.postsService.updateById(id, body)

    res.sendStatus(204)
  }

  private async deleteById({ params }: Request<PostExist>, res: Response) {
    const { id } = params

    await this.postsService.deleteById(id)

    res.sendStatus(204)
  }

  private async getAllCommentById(
    {
      params,
      query,
    }: Request<PostExist, {}, {}, GetCommentsRequestQuery<string>>,
    res: Response
  ) {
    const { id } = params

    const result = await this.commentsService.getAllByPostId({
      postId: id,
      query,
    })

    return res.status(200).json(result)
  }

  private async createCommentById(
    { params, body, context }: Request<PostExist, {}, BaseCommentDto>,
    res: Response
  ) {
    const { id: postId } = params
    const { content } = body
    const {
      user: { login, id: userId },
    } = context

    const result = await this.commentsService.create({
      postId,
      content,
      commentatorInfo: {
        userId,
        userLogin: login,
      },
    })

    res.status(201).json(result)
  }
}

export { PostsController }
