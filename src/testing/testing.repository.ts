import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { VideoModel } from '../videos'
import { PostModel } from '../posts'
import { BlogModel } from '../blogs'
import { UserModel } from '../users'
import { TYPES } from '../types'
import { CommentModel } from '../comments'
import { EmailConfirmationModel } from '../auth'
import { RefreshTokenMetaModel } from '../securityDevices'

@injectable()
class TestingRepository {
  constructor(
    @inject(TYPES.VideoModel)
    private readonly videoModel: typeof VideoModel,
    @inject(TYPES.BlogModel)
    private readonly blogModel: typeof BlogModel,
    @inject(TYPES.PostModel)
    private readonly postModel: typeof PostModel,
    @inject(TYPES.UserModel)
    private readonly userModel: typeof UserModel,
    @inject(TYPES.CommentModel)
    private readonly commentModel: typeof CommentModel,
    @inject(TYPES.EmailConfirmationModel)
    private readonly emailConfirmationModel: typeof EmailConfirmationModel,
    @inject(TYPES.RefreshTokenMetaModel)
    private readonly refreshTokenMetaModel: typeof RefreshTokenMetaModel
  ) {}

  public deleteAll = async () => {
    await this.videoModel.deleteMany()
    await this.blogModel.deleteMany()
    await this.postModel.deleteMany()
    await this.userModel.deleteMany()
    await this.commentModel.deleteMany()
    await this.emailConfirmationModel.deleteMany()
    await this.refreshTokenMetaModel.deleteMany()
  }
}

export { TestingRepository }
