import { AVAILABLE_RESOLUTIONS } from '../videos/constants'

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

interface IBlog {
  id: string
  name: string
  description: string
  websiteUrl: string
}

interface IPost {
  id: string
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
}

export { AvailableResolutionsType, IVideo, IBlog, IPost }
