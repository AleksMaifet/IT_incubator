import { Request, Response } from 'express'
import { BaseController } from '../common/base.controller'
import { ValidateMiddleware } from '../middlewares'
import { VideosRepository } from './videos.repository'
import { CreateVideoDto, UpdateVideoDto } from './dto'

class VideosController extends BaseController {
  constructor(private readonly videoRepository: VideosRepository) {
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

  getAll = (_: Request, res: Response) => {
    const result = this.videoRepository.getAll()

    res.status(200).json(result)
  }
  getById = ({ params }: Request<{ id?: string }>, res: Response) => {
    const { id } = params

    if (!id) {
      res.sendStatus(404)
      return
    }

    const result = this.videoRepository.getById(+id)

    if (!result) {
      res.sendStatus(404)
      return
    }

    res.status(200).json(result)
  }

  create = ({ body }: Request<{}, {}, CreateVideoDto>, res: Response) => {
    const result = this.videoRepository.create(body)

    res.status(201).json(result)
  }
  updateById = (
    { params, body }: Request<{ id?: string }, {}, UpdateVideoDto>,
    res: Response
  ) => {
    const { id } = params

    if (!id) {
      res.sendStatus(404)
      return
    }

    const result = this.videoRepository.updateById(+id, body)

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

    const result = this.videoRepository.deleteById(+id)

    if (!result) {
      res.sendStatus(404)
      return
    }

    res.sendStatus(204)
  }
}

export { VideosController }
