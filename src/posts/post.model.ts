import { model, Schema } from 'mongoose'
import { IPost } from './interfaces'

const PostSchema = new Schema<IPost>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: Date, required: true },
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

const PostModel = model<IPost>('Post', PostSchema)

export { PostModel }
