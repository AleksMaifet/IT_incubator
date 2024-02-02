import { ILikes } from './interfaces'
import { LIKE_USER_STATUS_ENUM } from '../comments'

class Likes implements ILikes {
  likeStatusComments: {
    status: LIKE_USER_STATUS_ENUM
    commentId: string
    createdAt: Date
  }[]
  likeStatusPosts: {
    status: LIKE_USER_STATUS_ENUM
    postId: string
    createdAt: Date
  }[]

  constructor(
    public likerInfo: {
      userId: string
      userLogin: string
    }
  ) {
    this.likeStatusComments = []
    this.likeStatusPosts = []
  }
}

export { Likes }
