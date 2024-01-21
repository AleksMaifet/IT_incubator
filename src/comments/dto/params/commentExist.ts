import { Validate } from 'class-validator'
import { IsCommentExist } from '@src/middlewares/libs/customValidDecorators'

class CommentExist {
  @Validate(IsCommentExist, {
    message: 'Comment is not exists',
  })
  readonly id: string
}

export { CommentExist }
