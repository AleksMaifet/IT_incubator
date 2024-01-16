import { Types } from 'mongoose'

class User {
  public readonly id: string
  public readonly createdAt: Date

  constructor(
    public readonly login: string,
    public readonly email: string,
    public readonly passwordSalt: string,
    public readonly passwordHash: string
  ) {
    this.id = new Types.ObjectId().toString()
    this.createdAt = new Date()
  }
}

export { User }
