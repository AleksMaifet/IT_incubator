import { Request, Response } from 'express'
import { BaseController } from '../common/base.controller'
import { TestingRepository } from './testing.repository'

class TestingController extends BaseController {
  constructor(private readonly testingRepository: TestingRepository) {
    super()
    this.bindRoutes({
      path: '/all-data',
      method: 'delete',
      func: this.cleanDBs,
    })
  }

  cleanDBs = async (_: Request, res: Response) => {
    await this.testingRepository.deleteAll()

    res.sendStatus(204)
  }
}

export { TestingController }
