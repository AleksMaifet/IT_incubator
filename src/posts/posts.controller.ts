import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { BaseController } from '../common/base.controller'
import {
  AuthMiddlewareGuard,
  ValidateBodyMiddleware,
  ValidateParamsMiddleware,
} from '../middlewares'
import { TYPES } from '../types'
import { CreatePostDto, UpdatePostDto } from './dto/body'
import { PostsService } from './posts.service'
import { PostExist } from './dto/params'
import { GetPostsRequestQuery } from './interfaces'

@injectable()
class PostsController extends BaseController {
  constructor(
    @inject(TYPES.PostsService)
    private readonly postsService: PostsService,
    @inject(TYPES.AuthMiddlewareGuard)
    private readonly authMiddlewareGuard: AuthMiddlewareGuard
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
        this.authMiddlewareGuard,
        new ValidateBodyMiddleware(CreatePostDto),
      ],
    })
    this.bindRoutes({
      path: '/:id',
      method: 'put',
      func: this.updateById,
      middlewares: [
        this.authMiddlewareGuard,
        new ValidateParamsMiddleware(PostExist),
        new ValidateBodyMiddleware(UpdatePostDto),
      ],
    })
    this.bindRoutes({
      path: '/:id',
      method: 'delete',
      func: this.deleteById,
      middlewares: [
        this.authMiddlewareGuard,
        new ValidateParamsMiddleware(PostExist),
      ],
    })
  }

  getAll = async (
    req: Request<{}, {}, {}, GetPostsRequestQuery<string>>,
    res: Response
  ) => {
    const { query } = req

    const result = await this.postsService.getAll(query)

    res.status(200).json(result)
  }
  getById = async ({ params }: Request<PostExist>, res: Response) => {
    const { id } = params

    const result = await this.postsService.getById(id)

    res.status(200).json(result)
  }

  create = async ({ body }: Request<{}, {}, CreatePostDto>, res: Response) => {
    const result = await this.postsService.create(body)

    res.status(201).json(result)
  }
  updateById = async (
    { params, body }: Request<PostExist, {}, UpdatePostDto>,
    res: Response
  ) => {
    const { id } = params

    await this.postsService.updateById(id, body)

    res.sendStatus(204)
  }
  deleteById = async ({ params }: Request<PostExist>, res: Response) => {
    const { id } = params

    await this.postsService.deleteById(id)

    res.sendStatus(204)
  }
}

export { PostsController }
