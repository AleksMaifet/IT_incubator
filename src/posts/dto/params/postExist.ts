import { Validate } from 'class-validator'
import { IsPostExist } from '../../../middlewares/libs/customValidDecorators'

class PostExist {
  @Validate(IsPostExist, {
    message: 'Post is not exists',
  })
  readonly id: string
}

export { PostExist }
