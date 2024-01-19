import { Types } from 'mongoose'
import { IComments } from './interfaces'

class Comment implements IComments {
  public readonly id: string
  public readonly createdAt: Date

  constructor(
    public postId: string,
    public content: string,
    public commentatorInfo: {
      userId: string
      userLogin: string
    }
  ) {
    this.id = new Types.ObjectId().toString()
    this.createdAt = new Date()
  }
}

export { Comment }
