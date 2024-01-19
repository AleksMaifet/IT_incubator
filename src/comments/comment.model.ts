import { model, Schema } from 'mongoose'
import { IComments } from './interfaces'

const CommentSchema = new Schema<IComments>(
  {
    id: {
      type: String,
      required: true,
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
