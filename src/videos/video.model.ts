import { model, Schema } from 'mongoose'
import { IVideo } from './interfaces'

const VideoSchema = new Schema<IVideo>(
  {
    id: { type: Number, required: true, index: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    canBeDownloaded: { type: Boolean, required: true },
    minAgeRestriction: { type: Number, default: null },
    createdAt: { type: String, required: true },
    publicationDate: { type: String, required: true },
    availableResolutions: { type: Schema.Types.Mixed, required: true },
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

const VideoModel = model<IVideo>('Videos', VideoSchema)

export { VideoModel }
