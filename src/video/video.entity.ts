import { AvailableResolutionsType, IVideo } from './interface'

class Video implements IVideo {
  public readonly id
  public readonly title
  public readonly author
  public readonly canBeDownloaded
  public readonly minAgeRestriction
  public readonly createdAt
  public readonly publicationDate
  public readonly availableResolutions

  constructor(
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: Nullable<number>,
    availableResolutions: AvailableResolutionsType
  ) {
    const createdAt = new Date()
    const publicationDate = createdAt
    publicationDate.setDate(createdAt.getDate() + 1)

    this.id = createdAt.getTime()
    this.title = title
    this.author = author
    this.canBeDownloaded = canBeDownloaded
    this.minAgeRestriction = minAgeRestriction
    this.createdAt = createdAt.toISOString()
    this.publicationDate = publicationDate.toISOString()
    this.availableResolutions = availableResolutions
  }

  get _id() {
    return this.id
  }

  get _title() {
    return this.title
  }

  get _author() {
    return this.author
  }

  get _canBeDownloaded() {
    return this.canBeDownloaded
  }

  get _minAgeRestriction() {
    return this.minAgeRestriction
  }

  get _createdAt() {
    return this.createdAt
  }

  get _publicationDate() {
    return this.publicationDate
  }

  get _availableResolutions() {
    return this.availableResolutions
  }
}

export { Video }
