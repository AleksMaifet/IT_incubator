import { Validate } from 'class-validator'
import { IsBlogExist } from '../../../middlewares/libs/customValidDecorators'

class BlogExist {
  @Validate(IsBlogExist, {
    message: 'blog is not exists',
  })
  readonly id: string
}

export { BlogExist }
