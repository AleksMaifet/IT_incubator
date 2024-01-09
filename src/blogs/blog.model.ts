import { model, Schema } from 'mongoose'

interface IBlog {
  id: string
  name: string
  description: string
  websiteUrl: string
  createdAt: Date
  isMembership: boolean
}

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
