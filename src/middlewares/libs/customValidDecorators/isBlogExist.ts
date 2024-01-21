import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { BlogsRepository } from '../../../blogs'
import { TYPES } from '../../../types'

@ValidatorConstraint({ async: true })
@injectable()
class IsBlogExist implements ValidatorConstraintInterface {
  constructor(
    @inject(TYPES.BlogsRepository)
    private readonly blogsRepository: BlogsRepository
  ) {}

  async validate(id: string) {
    const blog = await this.blogsRepository.getById(id)

    return !!blog
  }
}

export { IsBlogExist }