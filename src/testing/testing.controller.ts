import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { BaseController } from '../common'
import { TYPES } from '../types'
import { TestingRepository } from './testing.repository'

@injectable()
class TestingController extends BaseController {
  constructor(
    @inject(TYPES.TestingRepository)
    private readonly testingRepository: TestingRepository
  ) {
    super()
    this.bindRoutes({
      path: '/all-data',
      method: 'delete',
      func: this.cleanDBs,
    })
  }

  private cleanDBs = async (_: Request, res: Response) => {
    await this.testingRepository.deleteAll()

    res.sendStatus(204)
  }
}

export { TestingController }
