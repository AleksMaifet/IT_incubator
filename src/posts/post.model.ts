import { model, Schema } from 'mongoose'

interface IPost {
  id: string
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: Date
  isMembership: boolean
}

const PostSchema = new Schema<IPost>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: Date, required: true },
    isMembership: { type: Boolean, required: true },
  },
  { versionKey: false }
)

const PostModel = model<IPost>('Post', PostSchema)

export { PostModel }
