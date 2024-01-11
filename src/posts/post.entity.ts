class Post {
  public readonly id: string
  public readonly createdAt: Date

  constructor(
    public readonly title: string,
    public readonly shortDescription: string,
    public readonly content: string,
    public readonly blogId: string,
    public readonly blogName: string
  ) {
    this.id = new Date().getTime().toString()
    this.createdAt = new Date()
  }
}

export { Post }
