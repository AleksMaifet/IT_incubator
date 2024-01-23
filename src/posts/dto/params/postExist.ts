import { Validate } from 'class-validator'
import { IsPostExist } from '../../../middlewares/libs/customValidDecorators'

class PostExist {
  @Validate(IsPostExist, {
    message: 'post is not exists',
  })
  readonly id: string
}

export { PostExist }
