import { BlogsRepository } from './blogs.repository'
import { CreateBlogDto, UpdateBlogDto } from './dto'
import { Blog } from './blog.entity'

class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  public getAll = async () => {
    return await this.blogsRepository.getAll()
  }

  public getById = async (id: string) => {
    return await this.blogsRepository.getById(id)
  }

  public updateById = async (id: string, dto: UpdateBlogDto) => {
    return await this.blogsRepository.updateById(id, dto)
  }

  public create = async ({ name, description, websiteUrl }: CreateBlogDto) => {
    const newBlog = new Blog(name, description, websiteUrl)

    return await this.blogsRepository.create(newBlog)
  }

  public deleteById = async (id: string) => {
    return await this.blogsRepository.deleteById(id)
  }
}

export { BlogsService }
