import { LIKE_USER_STATUS_ENUM } from '../comments'

type CommentInfoLikeType<T> = {
  status: T
  info: {
    commentId: string
    createdAt: Date
  }[]
}

type PostInfoLikeType<T> = {
  status: T
  info: {
    postId: string
    createdAt: Date
  }[]
}

interface ILikes {
  likerInfo: {
    userId: string
    userLogin: string
  }
  likeComments: CommentInfoLikeType<LIKE_USER_STATUS_ENUM.Like>
  likePosts: PostInfoLikeType<LIKE_USER_STATUS_ENUM.Like>
  dislikeComments: CommentInfoLikeType<LIKE_USER_STATUS_ENUM.Dislike>
  dislikePosts: PostInfoLikeType<LIKE_USER_STATUS_ENUM.Dislike>
}

export { ILikes, CommentInfoLikeType, PostInfoLikeType }
