import { model, Schema } from 'mongoose'
import { IComments } from './interfaces'

const CommentSchema = new Schema<IComments>(
  {
    id: {
      type: String,
      required: true,
      index: true,
    },
    postId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    commentatorInfo: {
      userId: {
        type: String,
        required: true,
      },
      userLogin: {
        type: String,
        required: true,
      },
    },
    createdAt: {
      type: Date,
      required: true,
    },
    likesInfo: {
      likesCount: {
        type: Number,
        required: true,
      },
      dislikesCount: {
        type: Number,
        required: true,
      },
      myStatus: {
        type: Schema.Types.Mixed,
        required: true,
      },
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

const CommentModel = model<IComments>('Comments', CommentSchema)

export { CommentModel }
