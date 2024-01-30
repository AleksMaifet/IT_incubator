import { Validate } from 'class-validator'
import { IsVideoExist } from '../../../middlewares'

class VideoExist {
  @Validate(IsVideoExist, {
    message: 'video is not exists',
  })
  readonly id: string
}

export { VideoExist }
