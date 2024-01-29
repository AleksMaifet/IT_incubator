import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../../types'
import { UsersRepository } from '../../../users'
import { AuthRepository } from '../../../auth'

@ValidatorConstraint({ async: true })
@injectable()
class IsRegEmailResendingValid implements ValidatorConstraintInterface {
  constructor(
    @inject(TYPES.UsersRepository)
    private readonly usersRepository: UsersRepository,
    @inject(TYPES.AuthRepository)
    private readonly authRepository: AuthRepository
  ) {}

  async validate(email: string) {
    const user = await this.usersRepository.getByLoginOrEmail(email)

    if (!user) return false

    const { id } = user

    const confirmation =
      await this.authRepository.getEmailConfirmationByCodeOrUserId(id)

    return !!confirmation
  }
}

export { IsRegEmailResendingValid }
