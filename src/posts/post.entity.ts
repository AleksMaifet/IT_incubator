class Post {
  public readonly id: string
  public readonly createdAt: Date
  public readonly isMembership: boolean

  constructor(
    public readonly title: string,
    public readonly shortDescription: string,
    public readonly content: string,
    public readonly blogId: string,
    public readonly blogName: string
  ) {
    this.id = new Date().getTime().toString()
    this.createdAt = new Date()
    this.isMembership = true
  }

  get getId() {
    return this.id
  }

  get getTitle() {
    return this.title
  }

  get getShortDescription() {
    return this.shortDescription
  }

  get getContent() {
    return this.content
  }

  get getBlogId() {
    return this.blogId
  }

  get getBlogName() {
    return this.blogName
  }

  get getCreatedAt() {
    return this.createdAt
  }

  // get getIsMembership() {
  //   return this.isMembership
  // }
}

export { Post }
