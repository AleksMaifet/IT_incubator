import { VideoModel } from '../videos'
import { PostModel } from '../posts'
import { BlogModel } from '../blogs'

class TestingRepository {
  constructor(
    private readonly videoModel: typeof VideoModel,
    private readonly blogModel: typeof BlogModel,
    private readonly postModel: typeof PostModel
  ) {}

  public deleteAll = async () => {
    await this.videoModel.deleteMany()
    await this.blogModel.deleteMany()
    await this.postModel.deleteMany()
  }
}

export { TestingRepository }
