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
    likeComments: {
      status: {
        type: String,
        enum: LIKE_USER_STATUS_ENUM.Like,
        required: true,
      },
      info: [
        {
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
    },
    likePosts: {
      status: {
        type: String,
        enum: LIKE_USER_STATUS_ENUM.Like,
        required: true,
      },
      info: [
        {
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
    dislikeComments: {
      status: {
        type: String,
        enum: LIKE_USER_STATUS_ENUM.Dislike,
        required: true,
      },
      info: [
        {
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
    },
    dislikePosts: {
      status: {
        type: String,
        enum: LIKE_USER_STATUS_ENUM.Dislike,
        required: true,
      },
      info: [
        {
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
