import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { TYPES } from '@src/types'
import { VideosRepository } from '@src/videos'

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
