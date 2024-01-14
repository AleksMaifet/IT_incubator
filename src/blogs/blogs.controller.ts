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
import { BasePostDto, PostsService } from '../posts'
import { BlogExist } from './dto/params'
import { CreateBlogDto, UpdateBlogDto } from './dto/body'
import { BlogsService } from './blogs.service'
import { GetBlogsRequestQuery } from './interfaces'

@injectable()
class BlogsController extends BaseController {
  constructor(
    @inject(TYPES.BlogsService) private readonly blogsService: BlogsService,
    @inject(TYPES.PostsService) private readonly postsService: PostsService,
    @inject(TYPES.AuthMiddlewareGuard)
    private readonly authMiddlewareGuard: AuthMiddlewareGuard
  ) {
    super()
    this.bindRoutes({
      path: '/',
      method: 'get',
      func: this.getAll,
    })
    this.bindRoutes({
      path: '',
      method: 'post',
      func: this.create,
      middlewares: [
        this.authMiddlewareGuard,
        new ValidateBodyMiddleware(CreateBlogDto),
      ],
    })
    this.bindRoutes({
      path: '/:id',
      method: 'get',
      func: this.getById,
      middlewares: [new ValidateParamsMiddleware(BlogExist)],
    })
    this.bindRoutes({
      path: '/:id/posts',
      method: 'get',
      func: this.getPostsByBlogId,
      middlewares: [new ValidateParamsMiddleware(BlogExist)],
    })
    this.bindRoutes({
      path: '/:id/posts',
      method: 'post',
      func: this.createPostByBlogId,
      middlewares: [
        this.authMiddlewareGuard,
        new ValidateParamsMiddleware(BlogExist),
      ],
    })
    this.bindRoutes({
      path: '/:id',
      method: 'put',
      func: this.updateById,
      middlewares: [
        this.authMiddlewareGuard,
        new ValidateParamsMiddleware(BlogExist),
        new ValidateBodyMiddleware(UpdateBlogDto),
      ],
    })
    this.bindRoutes({
      path: '/:id',
      method: 'delete',
      func: this.deleteById,
      middlewares: [
        this.authMiddlewareGuard,
        new ValidateParamsMiddleware(BlogExist),
      ],
    })
  }

  public getAll = async (
    req: Request<{}, {}, {}, GetBlogsRequestQuery<string>>,
    res: Response
  ) => {
    const { query } = req

    const result = await this.blogsService.getAll(query)

    res.status(200).json(result)
  }
  public getById = async ({ params }: Request<BlogExist>, res: Response) => {
    const { id } = params

    const result = await this.blogsService.getById(id)

    res.status(200).json(result)
  }

  public getPostsByBlogId = async (
    {
      params,
      query,
    }: Request<
      BlogExist,
      {},
      {},
      Omit<GetBlogsRequestQuery<string>, 'searchNameTerm'>
    >,
    res: Response
  ) => {
    const { id } = params

    const result = await this.blogsService.getPostsByBlogId(id, query)

    res.status(200).json(result)
  }

  public createPostByBlogId = async (
    { body, params }: Request<BlogExist, {}, BasePostDto>,
    res: Response
  ) => {
    const { id } = params

    const result = await this.postsService.create({ ...body, blogId: id })

    res.status(201).json(result)
  }

  public create = async (
    { body }: Request<{}, {}, CreateBlogDto>,
    res: Response
  ) => {
    const result = await this.blogsService.create(body)

    res.status(201).json(result)
  }
  public updateById = async (
    { params, body }: Request<BlogExist, {}, UpdateBlogDto>,
    res: Response
  ) => {
    const { id } = params

    await this.blogsService.updateById(id, body)

    res.sendStatus(204)
  }
  public deleteById = async ({ params }: Request<BlogExist>, res: Response) => {
    const { id } = params

    await this.blogsService.deleteById(id)

    res.sendStatus(204)
  }
}

export { BlogsController }
