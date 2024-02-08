import { model, Schema } from 'mongoose'
import { IPost } from './interfaces'

const PostSchema = new Schema<IPost>(
  {
    id: { type: String, required: true, index: true },
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true, index: true },
    blogName: { type: String, required: true },
    createdAt: { type: Date, required: true },
    extendedLikesInfo: {
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
      newestLikes: [
        {
          addedAt: { type: Date, required: true },
          userId: { type: String, required: true },
          login: { type: String, required: true },
          _id: false,
        },
      ],
    },
  },
  {
    toJSON: {
      transform: function (r, ret) {
        delete ret.__v
        delete ret._id
      },
    },
  }
)

const PostModel = model<IPost>('Posts', PostSchema)

export { PostModel }
