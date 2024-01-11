import { CreateBlogDto, UpdateBlogDto } from './dto'
import { BlogModel } from './blog.model'

class BlogsRepository {
  constructor(private readonly blogModel: typeof BlogModel) {}

  public getAll = async () => {
    return await this.blogModel.find().exec()
  }

  public getById = async (id: string) => {
    return await this.blogModel.findOne({ id }).exec()
  }

  public updateById = async (id: string, dto: UpdateBlogDto) => {
    return await this.blogModel.findOneAndUpdate({ id }, dto).exec()
  }

  public create = async (dto: CreateBlogDto) => {
    return await this.blogModel.create(dto)
  }

  public deleteById = async (id: string) => {
    return await this.blogModel.findOneAndDelete({ id }).exec()
  }
}

export { BlogsRepository }
