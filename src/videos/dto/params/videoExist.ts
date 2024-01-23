import { Validate } from 'class-validator'
import { IsVideoExist } from '../../../middlewares/libs/customValidDecorators'

class VideoExist {
  @Validate(IsVideoExist, {
    message: 'video is not exists',
  })
  readonly id: string
}

export { VideoExist }
