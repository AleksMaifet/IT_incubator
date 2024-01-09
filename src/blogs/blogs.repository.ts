import { Blog } from './blog.entity'
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

  public updateById = async (id: string, body: UpdateBlogDto) => {
    return await this.blogModel.findOneAndUpdate({ id }, body).exec()
  }

  public create = async ({ name, description, websiteUrl }: CreateBlogDto) => {
    const newBlog = new Blog(name, description, websiteUrl)

    return await this.blogModel.create(newBlog)
  }

  public deleteById = async (id: string) => {
    return await this.blogModel.findOneAndDelete({ id }).exec()
  }
}

export { BlogsRepository }
