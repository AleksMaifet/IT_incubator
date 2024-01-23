import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../../types'
import { AuthRepository } from '../../../auth'

@ValidatorConstraint({ async: true })
@injectable()
class IsRegConfirmationValid implements ValidatorConstraintInterface {
  constructor(
    @inject(TYPES.AuthRepository)
    private readonly authRepository: AuthRepository
  ) {}

  async validate(code: string) {
    const confirmation =
      await this.authRepository.getConfirmationByCodeOrUserId(code)

    switch (true) {
      case !confirmation:
        return false
      case confirmation!.expiresIn < new Date():
        return false
      case confirmation!.isConfirmed:
        return false
      default:
        return true
    }
  }
}

export { IsRegConfirmationValid }
