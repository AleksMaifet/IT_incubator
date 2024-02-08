import { IUserPostLike } from '../interfaces'

class UserLikeInfoEntity implements IUserPostLike {
  public addedAt: Date

  constructor(
    public readonly login: string,
    public userId: string
  ) {
    this.addedAt = new Date()
  }
}

export { UserLikeInfoEntity }
