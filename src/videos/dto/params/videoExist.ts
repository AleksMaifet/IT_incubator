import { Validate } from 'class-validator'
import { IsVideoExist } from '../../../middlewares/libs/customValidDecorators'

class VideoExist {
  @Validate(IsVideoExist, {
    message: 'Video is not exists',
  })
  readonly id: string
}

export { VideoExist }
