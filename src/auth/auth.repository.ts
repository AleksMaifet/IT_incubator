import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { v4 as uuidv4 } from 'uuid'
import { TYPES } from '../types'
import { IEmailConfirmation, IPasswordRecoveryConfirmation } from './interfaces'
import {
  EmailConfirmationModel,
  PasswordRecoveryConfirmationModel,
} from './models'

@injectable()
class AuthRepository {
  constructor(
    @inject(TYPES.EmailConfirmationModel)
    private readonly emailConfirmationModel: typeof EmailConfirmationModel,
    @inject(TYPES.PasswordRecoveryConfirmationModel)
    private readonly passwordRecoveryConfirmationModel: typeof PasswordRecoveryConfirmationModel
  ) {}

  public createEmailConfirmation = async (dto: IEmailConfirmation) => {
    return await this.emailConfirmationModel.create(dto)
  }

  public createPasswordRecoveryConfirmation = async (
    dto: IPasswordRecoveryConfirmation
  ) => {
    return await this.passwordRecoveryConfirmationModel.create(dto)
  }

  public deleteEmailConfirmationByUserId = async (userId: string) => {
    return await this.emailConfirmationModel.deleteOne({ userId }).exec()
  }

  public deleteEmailConfirmationByCode = async (code: string) => {
    return await this.emailConfirmationModel.deleteOne({ code }).exec()
  }

  public deletePasswordRecoveryConfirmationByUserId = async (
    userId: string
  ) => {
    return await this.passwordRecoveryConfirmationModel
      .deleteOne({ userId })
      .exec()
  }

  public getEmailConfirmationByCodeOrUserId = async (codeOrUserId: string) => {
    return await this.emailConfirmationModel
      .findOne({
        $or: [{ code: codeOrUserId }, { userId: codeOrUserId }],
      })
      .exec()
  }

  public getPasswordRecoveryConfirmationByCode = async (code: string) => {
    return await this.passwordRecoveryConfirmationModel.findOne({ code }).exec()
  }

  public updateEmailConfirmationCode = async (userId: string) => {
    return await this.emailConfirmationModel
      .findOneAndUpdate({ userId }, { code: uuidv4() }, { new: true })
      .exec()
  }
}

export { AuthRepository }
