import { model, Schema } from 'mongoose'
import { IBlog } from './interfaces'

const BlogSchema = new Schema<IBlog>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: Date, required: true },
    isMembership: { type: Boolean, required: true },
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

const BlogModel = model<IBlog>('Blog', BlogSchema)

export { BlogModel }
