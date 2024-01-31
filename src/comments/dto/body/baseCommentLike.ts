import { IsIn, IsString } from 'class-validator'
import { LIKE_USER_STATUS_ENUM } from '../../interfaces'

class BaseCommentLikeDto {
  @IsString()
  @IsIn(Object.values(LIKE_USER_STATUS_ENUM))
  readonly likeStatus: LIKE_USER_STATUS_ENUM
}

export { BaseCommentLikeDto }
