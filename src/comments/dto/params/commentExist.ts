import { Validate } from 'class-validator'
import { IsCommentExist } from '../../../middlewares'

class CommentExist {
  @Validate(IsCommentExist, {
    message: 'comment is not exists',
  })
  readonly id: string
}

export { CommentExist }
