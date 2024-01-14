import { Validate } from 'class-validator'
import { IsBlogExist } from '@src/middlewares/libs/customValidDecorators'

class BlogExist {
  @Validate(IsBlogExist, {
    message: 'Blog is not exists',
  })
  readonly id: string
}

export { BlogExist }