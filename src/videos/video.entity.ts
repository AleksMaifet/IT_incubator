import { AvailableResolutionsType } from './video.model'

class Video {
  public readonly id: number
  public readonly createdAt: string
  public readonly publicationDate: string

  constructor(
    public readonly title: string,
    public readonly author: string,
    public readonly canBeDownloaded: boolean,
    public readonly minAgeRestriction: Nullable<number>,
    public readonly availableResolutions: AvailableResolutionsType
  ) {
    const createdAt = new Date()
    const publicationDate = new Date()
    publicationDate.setDate(createdAt.getDate() + 1)

    this.id = createdAt.getTime()
    this.createdAt = createdAt.toISOString()
    this.publicationDate = publicationDate.toISOString()
  }
}

export { Video }
