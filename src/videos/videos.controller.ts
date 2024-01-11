import { Request, Response } from 'express'
import { BaseController } from '../common/base.controller'
import { ValidateMiddleware } from '../middlewares'
import { CreateVideoDto, UpdateVideoDto } from './dto'
import { VideosService } from './videos.service'

class VideosController extends BaseController {
  constructor(private readonly videosService: VideosService) {
    super()
    this.bindRoutes({ path: '/', method: 'get', func: this.getAll })
    this.bindRoutes({ path: '/:id', method: 'get', func: this.getById })
    this.bindRoutes({
      path: '',
      method: 'post',
      func: this.create,
      middlewares: [new ValidateMiddleware(CreateVideoDto)],
    })
    this.bindRoutes({
      path: '/:id',
      method: 'put',
      func: this.updateById,
      middlewares: [new ValidateMiddleware(UpdateVideoDto)],
    })
    this.bindRoutes({ path: '/:id', method: 'delete', func: this.deleteById })
  }

  getAll = async (_: Request, res: Response) => {
    const result = await this.videosService.getAll()

    res.status(200).json(result)
  }
  getById = async ({ params }: Request<{ id?: string }>, res: Response) => {
    const { id } = params

    if (!id) {
      res.sendStatus(404)
      return
    }

    const result = await this.videosService.getById(+id)

    if (!result) {
      res.sendStatus(404)
      return
    }

    res.status(200).json(result)
  }

  create = async ({ body }: Request<{}, {}, CreateVideoDto>, res: Response) => {
    const result = await this.videosService.create(body)

    res.status(201).json(result)
  }
  updateById = async (
    { params, body }: Request<{ id?: string }, {}, UpdateVideoDto>,
    res: Response
  ) => {
    const { id } = params

    if (!id) {
      res.sendStatus(404)
      return
    }

    const result = await this.videosService.updateById(+id, body)

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

    const result = await this.videosService.deleteById(+id)

    if (!result) {
      res.sendStatus(404)
      return
    }

    res.sendStatus(204)
  }
}

export { VideosController }
