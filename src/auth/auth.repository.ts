import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TYPES } from '../types'
import { UserModel } from '../users'

@injectable()
class AuthRepository {
  constructor(
    @inject(TYPES.UserModel) private readonly userModel: typeof UserModel
  ) {}

  public getByLoginOrEmail = async (loginOrEmail: string) => {
    return await this.userModel
      .findOne({
        $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
      })
      .exec()
  }
}

export { AuthRepository }
