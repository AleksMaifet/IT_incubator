import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { VideoModel } from '../videos'
import { PostModel } from '../posts'
import { BlogModel } from '../blogs'
import { TYPES } from '../types'

@injectable()
class TestingRepository {
  constructor(
    @inject(TYPES.VideoModel)
    private readonly videoModel: typeof VideoModel,
    @inject(TYPES.BlogModel)
    private readonly blogModel: typeof BlogModel,
    @inject(TYPES.PostModel)
    private readonly postModel: typeof PostModel
  ) {}

  public deleteAll = async () => {
    await this.videoModel.deleteMany()
    await this.blogModel.deleteMany()
    await this.postModel.deleteMany()
  }
}

export { TestingRepository }
