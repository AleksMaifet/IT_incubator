import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../../types'
import { CommentsRepository } from '../../../comments'

@ValidatorConstraint({ async: true })
@injectable()
class IsCommentExist implements ValidatorConstraintInterface {
  constructor(
    @inject(TYPES.CommentsRepository)
    private readonly commentsRepository: CommentsRepository
  ) {}

  async validate(id: string) {
    const comment = await this.commentsRepository.getById(id)

    return !!comment
  }
}

export { IsCommentExist }
