import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { BlackListRefreshTokenModel } from './blackListRefreshToken.model'
import { TYPES } from '../../types'

@injectable()
class BlackListRefreshTokenRepository {
  constructor(
    @inject(TYPES.BlackListRefreshTokenModel)
    private readonly blackListRefreshTokenModel: typeof BlackListRefreshTokenModel
  ) {}

  public createExpiredRefreshToken = async (token: string) => {
    return await this.blackListRefreshTokenModel.create({ token })
  }

  public getExpiredRefreshToken = async (token: string) => {
    return await this.blackListRefreshTokenModel.findOne({ token }).exec()
  }
}

export { BlackListRefreshTokenRepository }
