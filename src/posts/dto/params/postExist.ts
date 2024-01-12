import { Validate } from 'class-validator'
import { IsPostExist } from '@src/middlewares/libs/customValidDecorators'

class PostExist {
  @Validate(IsPostExist, {
    message: 'Post is not exists',
  })
  readonly id: string
}

export { PostExist }
