import { inject, injectable } from 'inversify'
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { VideosRepository } from '../../../videos'
import { TYPES } from '../../../types'

@ValidatorConstraint({ async: true })
@injectable()
class IsVideoExist implements ValidatorConstraintInterface {
  constructor(
    @inject(TYPES.VideosRepository)
    private readonly videosRepository: VideosRepository
  ) {}

  async validate(id: string) {
    const video = await this.videosRepository.getById(+id)

    return !!video
  }
}

export { IsVideoExist }
