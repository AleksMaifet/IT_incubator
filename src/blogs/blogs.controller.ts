import { Request, Response } from 'express'
import { BaseController } from '../common/base.controller'
import { ValidateMiddleware, AuthMiddlewareGuard } from '../middlewares'
import { ConfigService, LoggerService } from '../services'
import { BlogsRepository } from './blogs.repository'
import { CreateBlogDto, UpdateBlogDto } from './dto'

class BlogsController extends BaseController {
  constructor(private readonly blogsRepository: BlogsRepository) {
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

  getAll = (_: Request, res: Response) => {
    const result = this.blogsRepository.getAll()

    res.status(200).json(result)
  }
  getById = ({ params }: Request<{ id?: string }>, res: Response) => {
    const { id } = params

    if (!id) {
      res.sendStatus(404)
      return
    }

    const result = this.blogsRepository.getById(id)

    if (!result) {
      res.sendStatus(404)
      return
    }

    res.status(200).json(result)
  }

  create = ({ body }: Request<{}, {}, CreateBlogDto>, res: Response) => {
    const result = this.blogsRepository.create(body)

    res.status(201).json(result)
  }
  updateById = (
    { params, body }: Request<{ id?: string }, {}, UpdateBlogDto>,
    res: Response
  ) => {
    const { id } = params

    if (!id) {
      res.sendStatus(404)
      return
    }

    const result = this.blogsRepository.updateById(id, body)

    if (!result) {
      res.sendStatus(404)
      return
    }

    res.sendStatus(204)
  }
  deleteById = ({ params }: Request<{ id?: string }>, res: Response) => {
    const { id } = params

    if (!id) {
      res.sendStatus(404)
      return
    }

    const result = this.blogsRepository.deleteById(id)

    if (!result) {
      res.sendStatus(404)
      return
    }

    res.sendStatus(204)
  }
}

export { BlogsController }
