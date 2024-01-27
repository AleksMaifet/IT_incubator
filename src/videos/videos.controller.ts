import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { BaseController } from '../common'
import {
  ValidateBodyMiddleware,
  ValidateParamsMiddleware,
} from '../middlewares'
import { TYPES } from '../types'
import { CreateVideoDto, UpdateVideoDto, VideoExist } from './dto'
import { VideosService } from './videos.service'

@injectable()
class VideosController extends BaseController {
  constructor(
    @inject(TYPES.VideosService) private readonly videosService: VideosService
  ) {
    super()
    this.bindRoutes({ path: '/', method: 'get', func: this.getAll })
    this.bindRoutes({
      path: '/:id',
      method: 'get',
      func: this.getById,
      middlewares: [new ValidateParamsMiddleware(VideoExist)],
    })
    this.bindRoutes({
      path: '',
      method: 'post',
      func: this.create,
      middlewares: [new ValidateBodyMiddleware(CreateVideoDto)],
    })
    this.bindRoutes({
      path: '/:id',
      method: 'put',
      func: this.updateById,
      middlewares: [
        new ValidateParamsMiddleware(VideoExist),
        new ValidateBodyMiddleware(UpdateVideoDto),
      ],
    })
    this.bindRoutes({
      path: '/:id',
      method: 'delete',
      func: this.deleteById,
      middlewares: [new ValidateParamsMiddleware(VideoExist)],
    })
  }

  private getAll = async (req: Request, res: Response) => {
    const result = await this.videosService.getAll()

    res.status(200).json(result)
  }
  private getById = async ({ params }: Request<VideoExist>, res: Response) => {
    const { id } = params

    const result = await this.videosService.getById(+id)

    res.status(200).json(result)
  }

  private create = async (
    { body }: Request<{}, {}, CreateVideoDto>,
    res: Response
  ) => {
    const result = await this.videosService.create(body)

    res.status(201).json(result)
  }
  private updateById = async (
    { params, body }: Request<VideoExist, {}, UpdateVideoDto>,
    res: Response
  ) => {
    const { id } = params

    await this.videosService.updateById(+id, body)

    res.sendStatus(204)
  }
  private deleteById = async (
    { params }: Request<VideoExist>,
    res: Response
  ) => {
    const { id } = params

    await this.videosService.deleteById(+id)

    res.sendStatus(204)
  }
}

export { VideosController }
