import { Request, Response } from 'express'
import { BaseController } from '../common/base.controller'
import { AuthMiddlewareGuard, ValidateMiddleware } from '../middlewares'
import { ConfigService, LoggerService } from '../services'
import { CreateBlogDto, UpdateBlogDto } from './dto'
import { BlogsService } from './blogs.service'

class BlogsController extends BaseController {
  constructor(private readonly blogsService: BlogsService) {
    super()
    this.bindRoutes({ path: '/', method: 'get', func: this.getAll })
    this.bindRoutes({ path: '/:id', method: 'get', func: this.getById })
    this.bindRoutes({
      path: '',
      method: 'post',
      func: this.create,
      middlewares: [
        new AuthMiddlewareGuard(new ConfigService(new LoggerService())),
        new ValidateMiddleware(CreateBlogDto),
      ],
    })
    this.bindRoutes({
      path: '/:id',
      method: 'put',
      func: this.updateById,
      middlewares: [
        new AuthMiddlewareGuard(new ConfigService(new LoggerService())),
        new ValidateMiddleware(UpdateBlogDto),
      ],
    })
    this.bindRoutes({
      path: '/:id',
      method: 'delete',
      func: this.deleteById,
      middlewares: [
        new AuthMiddlewareGuard(new ConfigService(new LoggerService())),
      ],
    })
  }

  getAll = async (_: Request, res: Response) => {
    const result = await this.blogsService.getAll()

    res.status(200).json(result)
  }
  getById = async ({ params }: Request<{ id?: string }>, res: Response) => {
    const { id } = params

    if (!id) {
      res.sendStatus(404)
      return
    }

    const result = await this.blogsService.getById(id)

    if (!result) {
      res.sendStatus(404)
      return
    }

    res.status(200).json(result)
  }

  create = async ({ body }: Request<{}, {}, CreateBlogDto>, res: Response) => {
    const result = await this.blogsService.create(body)

    res.status(201).json(result)
  }
  updateById = async (
    { params, body }: Request<{ id?: string }, {}, UpdateBlogDto>,
    res: Response
  ) => {
    const { id } = params

    if (!id) {
      res.sendStatus(404)
      return
    }

    const result = await this.blogsService.updateById(id, body)

    if (!result) {
      res.sendStatus(404)
      return
    }

    res.sendStatus(204)
  }
  deleteById = async ({ params }: Request<{ id?: string }>, res: Response) => {
    const { id } = params

    if (!id) {
      res.sendStatus(404)
      return
    }

    const result = await this.blogsService.deleteById(id)

    if (!result) {
      res.sendStatus(404)
      return
    }

    res.sendStatus(204)
  }
}

export { BlogsController }
