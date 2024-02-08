import { model, Schema } from 'mongoose'
import { ILikes } from './interfaces'
import { LIKE_COMMENT_USER_STATUS_ENUM } from '../comments'
import { LIKE_POST_USER_STATUS_ENUM } from '../posts'

const LikesSchema = new Schema<ILikes>(
  {
    likerInfo: {
      userId: {
        type: String,
        required: true,
        index: true,
      },
      userLogin: {
        type: String,
        required: true,
      },
    },
    likeStatusComments: [
      {
        status: {
          type: String,
          enum: Object.values(LIKE_COMMENT_USER_STATUS_ENUM),
          required: true,
        },
        commentId: {
          type: String,
          required: true,
          index: true,
        },
        addedAt: {
          type: Date,
          required: true,
        },
      },
    ],
    likeStatusPosts: [
      {
        status: {
          type: String,
          enum: Object.values(LIKE_POST_USER_STATUS_ENUM),
          required: true,
        },
        postId: {
          type: String,
          required: true,
          index: true,
        },
        addedAt: {
          type: Date,
          required: true,
          index: true,
        },
      },
    ],
  },
  {
    toJSON: {
      transform: function (_, ret) {
        delete ret.__v
        delete ret._id
      },
    },
  }
)

const LikesModel = model<ILikes>('Likes', LikesSchema)

export { LikesModel }
