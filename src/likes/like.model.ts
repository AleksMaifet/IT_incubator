import { model, Schema } from 'mongoose'
import { ILikes } from './interfaces'
import { LIKE_USER_STATUS_ENUM } from '../comments'

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
          enum: Object.values(LIKE_USER_STATUS_ENUM),
          required: true,
        },
        commentId: {
          type: String,
          required: true,
          index: true,
        },
        createdAt: {
          type: Date,
          required: true,
        },
      },
    ],
    likeStatusPosts: [
      {
        status: {
          type: String,
          enum: Object.values(LIKE_USER_STATUS_ENUM),
          required: true,
        },
        postId: {
          type: String,
          required: true,
          index: true,
        },
        createdAt: {
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
