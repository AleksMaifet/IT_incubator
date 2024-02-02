import { LIKE_USER_STATUS_ENUM } from '../comments'

type CommentInfoLikeType<T> = {
  status: T
  commentId: string
  createdAt: Date
}

type PostInfoLikeType<T> = {
  status: T
  postId: string
  createdAt: Date
}

interface ILikes {
  likerInfo: {
    userId: string
    userLogin: string
  }
  likeStatusComments: CommentInfoLikeType<LIKE_USER_STATUS_ENUM>[]
  likeStatusPosts: PostInfoLikeType<LIKE_USER_STATUS_ENUM>[]
}

export { ILikes, CommentInfoLikeType, PostInfoLikeType }
