import { CreatePostDto, UpdatePostDto } from './dto'
import { PostModel } from './post.model'

class PostsRepository {
  constructor(private readonly postModel: typeof PostModel) {}

  public getAll = async () => {
    return await this.postModel.find().exec()
  }

  public getById = async (id: string) => {
    return await this.postModel.findOne({ id }).exec()
  }

  public updateById = async (id: string, dto: UpdatePostDto) => {
    return await this.postModel.findOneAndUpdate({ id }, dto).exec()
  }

  public create = async (dto: CreatePostDto) => {
    return await this.postModel.create(dto)
  }

  public deleteById = async (id: string) => {
    return await this.postModel.findOneAndDelete({ id }).exec()
  }
}

export { PostsRepository }
