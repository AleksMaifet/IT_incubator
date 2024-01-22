import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TYPES } from '../types'
import { IEmailConfirmation } from './interfaces'
import { EmailConfirmationModel } from './emailConfirmation.model'

@injectable()
class AuthRepository {
  constructor(
    @inject(TYPES.EmailConfirmationModel)
    private readonly emailConfirmationModel: typeof EmailConfirmationModel
  ) {}

  public createEmailConfirmation = async (dto: IEmailConfirmation) => {
    return await this.emailConfirmationModel.create(dto)
  }

  public deleteEmailConfirmation = async (userId: string) => {
    return await this.emailConfirmationModel.deleteOne({ userId }).exec()
  }

  public getConfirmationByCodeOrUserId = async (codeOrUserId: string) => {
    return await this.emailConfirmationModel
      .findOne({
        $or: [{ code: codeOrUserId }, { userId: codeOrUserId }],
      })
      .exec()
  }

  public updateConfirmationByCode = async (code: string) => {
    return await this.emailConfirmationModel
      .findOneAndUpdate({ code }, { isConfirmed: true })
      .exec()
  }
}

export { AuthRepository }
