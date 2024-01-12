import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { TYPES } from '@src/types'
import { PostsRepository } from '@src/posts'

@ValidatorConstraint({ async: true })
@injectable()
class IsPostExist implements ValidatorConstraintInterface {
  constructor(
    @inject(TYPES.PostsRepository)
    private readonly postsRepository: PostsRepository
  ) {}

  async validate(id: string) {
    const post = await this.postsRepository.getById(id)

    return !!post
  }
}

export { IsPostExist }
