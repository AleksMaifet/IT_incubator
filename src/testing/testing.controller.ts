import { Request, Response } from 'express'
import { BaseController } from '../common/base.controller'
import { VideoRepository } from '../video'

class TestingController extends BaseController {
  constructor(private readonly videoRepository: VideoRepository) {
    super()
    this.bindRoutes({
      path: '/all-data',
      method: 'delete',
      func: this.cleanDBs,
    })
  }

  cleanDBs = (_: Request, res: Response) => {
    this.videoRepository.deleteAll()

    res.sendStatus(204)
  }
}

export { TestingController }
