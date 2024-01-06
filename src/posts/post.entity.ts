class Post {
  public readonly id: string

  constructor(
    public readonly title: string,
    public readonly shortDescription: string,
    public readonly content: string,
    public readonly blogId: string,
    public readonly blogName: string
  ) {
    this.id = new Date().getTime().toString()
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
}

export { Post }
