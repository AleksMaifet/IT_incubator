class Blog {
  public readonly id: string
  public readonly createdAt: Date
  public readonly isMembership: boolean

  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly websiteUrl: string
  ) {
    this.id = new Date().getTime().toString()
    this.createdAt = new Date()
    this.isMembership = false
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

  get getCreatedAt() {
    return this.createdAt
  }

  // get getIsMembership() {
  //   return this.isMembership
  // }
}

export { Blog }
