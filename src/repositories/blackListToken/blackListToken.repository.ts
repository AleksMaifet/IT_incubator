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

  public createExpiredToken = async (token: string) => {
    return await this.blackListTokenModel.create({ expired: token })
  }

  public createRefreshedToken = async (token: string) => {
    return await this.blackListTokenModel.create({ refreshed: token })
  }

  public getExpiredToken = async (token: string) => {
    return await this.blackListTokenModel.findOne({ expired: token }).exec()
  }

  public getRefreshedToken = async (token: string) => {
    return await this.blackListTokenModel.findOne({ refreshed: token }).exec()
  }
}

export { BlackListTokenRepository }
