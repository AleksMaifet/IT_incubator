import { inject, injectable } from 'inversify'
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { TYPES } from '../../../types'
import { UsersRepository } from '../../../users'

@ValidatorConstraint({ async: true })
@injectable()
class IsUserNotExist implements ValidatorConstraintInterface {
  constructor(
    @inject(TYPES.UsersRepository)
    private readonly usersRepository: UsersRepository
  ) {}

  async validate(loginOrEmail: string) {
    const user = await this.usersRepository.getByLoginOrEmail(loginOrEmail)

    return !user
  }
}

export { IsUserNotExist }
