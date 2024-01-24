import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { BlackListTokenModel } from './blackListToken.model'
import { TYPES } from '../../types'

@injectable()
class BlackListTokenRepository {
  constructor(
    @inject(TYPES.BlackListTokenModel)
    private readonly blackListTokenModel: typeof BlackListTokenModel
  ) {}

  public create = async (token: string) => {
    return await this.blackListTokenModel.create({ token })
  }

  public get = async (token: string) => {
    return await this.blackListTokenModel.findOne({ token }).exec()
  }
}

export { BlackListTokenRepository }
