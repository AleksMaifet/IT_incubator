import { AvailableResolutionsType } from '../db/interface'

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

  get getId() {
    return this.id
  }

  get getTitle() {
    return this.title
  }

  get getAuthor() {
    return this.author
  }

  get getCanBeDownloaded() {
    return this.canBeDownloaded
  }

  get getMinAgeRestriction() {
    return this.minAgeRestriction
  }

  get getCreatedAt() {
    return this.createdAt
  }

  get getPublicationDate() {
    return this.publicationDate
  }

  get getAvailableResolutions() {
    return this.availableResolutions
  }
}

export { Video }
