import { Types } from 'mongoose'

class Blog {
  public readonly id: string
  public readonly createdAt: Date
  public readonly isMembership: boolean

  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly websiteUrl: string
  ) {
    this.id = new Types.ObjectId().toString()
    this.createdAt = new Date()
    this.isMembership = false
  }
}

export { Blog }
