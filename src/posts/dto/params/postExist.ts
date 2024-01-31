import { Validate } from 'class-validator'
import { IsPostExist } from '../../../middlewares'

class PostExist {
  @Validate(IsPostExist, {
    message: 'post is not exists',
  })
  readonly id: string
}

export { PostExist }
