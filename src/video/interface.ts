import { AVAILABLE_RESOLUTIONS } from './constants'

const availableResolutions = AVAILABLE_RESOLUTIONS

type AvailableResolutionsType = Nullable<
  (typeof availableResolutions)[number][]
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

export { AvailableResolutionsType, IVideo }
