import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { TYPES } from '../../../types'
import { UsersRepository } from '../../../users'

@ValidatorConstraint({ async: true })
@injectable()
class IsUserExist implements ValidatorConstraintInterface {
  constructor(
    @inject(TYPES.UsersRepository)
    private readonly usersRepository: UsersRepository
  ) {}

  async validate(id: string) {
    const video = await this.usersRepository.getById(id)

    return !!video
  }
}

export { IsUserExist }