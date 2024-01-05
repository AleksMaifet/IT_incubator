import { AVAILABLE_RESOLUTIONS } from '../video/constants'

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

export { AvailableResolutionsType, IVideo }
