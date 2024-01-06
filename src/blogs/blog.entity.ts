class Blog {
  public readonly id: string

  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly websiteUrl: string
  ) {
    this.id = new Date().getTime().toString()
  }

  get getId() {
    return this.id
  }

  get getName() {
    return this.name
  }

  get getDescription() {
    return this.description
  }

  get getWebsiteUrl() {
    return this.websiteUrl
  }
}

export { Blog }
