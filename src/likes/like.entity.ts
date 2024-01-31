import { ILikes } from './interfaces'
import { LIKE_USER_STATUS_ENUM } from '../comments'

class Likes implements ILikes {
  likeComments: {
    status: LIKE_USER_STATUS_ENUM.Like
    info: {
      commentId: string
      createdAt: Date
    }[]
  }
  likePosts: {
    status: LIKE_USER_STATUS_ENUM.Like
    info: {
      postId: string
      createdAt: Date
    }[]
  }
  dislikeComments: {
    status: LIKE_USER_STATUS_ENUM.Dislike
    info: {
      commentId: string
      createdAt: Date
    }[]
  }
  dislikePosts: {
    status: LIKE_USER_STATUS_ENUM.Dislike
    info: {
      postId: string
      createdAt: Date
    }[]
  }

  constructor(
    public likerInfo: {
      userId: string
      userLogin: string
    }
  ) {
    this.likeComments = {
      status: LIKE_USER_STATUS_ENUM.Like,
      info: [],
    }
    this.likePosts = {
      status: LIKE_USER_STATUS_ENUM.Like,
      info: [],
    }
    this.dislikeComments = {
      status: LIKE_USER_STATUS_ENUM.Dislike,
      info: [],
    }
    this.dislikePosts = {
      status: LIKE_USER_STATUS_ENUM.Dislike,
      info: [],
    }
  }
}

export { Likes }
