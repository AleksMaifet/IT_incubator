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

  public async createEmailConfirmation(dto: IEmailConfirmation) {
    return await this.emailConfirmationModel.create(dto)
  }

  public async passwordRecoveryConfirmation(
    dto: IPasswordRecoveryConfirmation
  ) {
    const { userId } = dto

    const result =
      await this.passwordRecoveryConfirmationModel.findOneAndUpdate(
        { userId },
        dto
      )

    if (!result) {
      return await this.passwordRecoveryConfirmationModel.create(dto)
    }

    return result
  }

  public async deleteEmailConfirmationByUserId(userId: string) {
    return await this.emailConfirmationModel.deleteOne({ userId }).exec()
  }

  public async deleteEmailConfirmationByCode(code: string) {
    return await this.emailConfirmationModel.deleteOne({ code }).exec()
  }

  public async deletePasswordRecoveryConfirmationByUserId(userId: string) {
    return await this.passwordRecoveryConfirmationModel
      .deleteOne({ userId })
      .exec()
  }

  public async getEmailConfirmationByCodeOrUserId(codeOrUserId: string) {
    return await this.emailConfirmationModel
      .findOne({
        $or: [{ code: codeOrUserId }, { userId: codeOrUserId }],
      })
      .exec()
  }

  public async getPasswordRecoveryConfirmationByCode(code: string) {
    return await this.passwordRecoveryConfirmationModel.findOne({ code }).exec()
  }

  public async updateEmailConfirmationCode(userId: string) {
    return await this.emailConfirmationModel
      .findOneAndUpdate({ userId }, { code: uuidv4() }, { new: true })
      .exec()
  }
}

export { AuthRepository }
