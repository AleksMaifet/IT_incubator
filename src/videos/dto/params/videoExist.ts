import { Validate } from 'class-validator'
import { IsVideoExist } from '@src/middlewares/libs/customValidDecorators'

class VideoExist {
  @Validate(IsVideoExist, {
    message: 'Video is not exists',
  })
  readonly id: string
}

export { VideoExist }
