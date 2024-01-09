import { model, Schema } from 'mongoose'
import { AVAILABLE_RESOLUTIONS } from './constants'

type AvailableResolutionsType = Nullable<
  (typeof AVAILABLE_RESOLUTIONS)[number][]
>

interface IVideo {
  id: number
  title: string
  author: string
  canBeDownloaded: boolean
  minAgeRestriction: Nullable<number>
  createdAt: string
  publicationDate: string
  availableResolutions: AvailableResolutionsType
}

const VideoSchema = new Schema<IVideo>(
  {
    id: { type: Number, required: true },
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

const VideoModel = model<IVideo>('Video', VideoSchema)

export { VideoModel, AvailableResolutionsType }
