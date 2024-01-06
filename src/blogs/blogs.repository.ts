import { DB } from '../db'
import { Blog } from './blog.entity'
import { CreateBlogDto, UpdateBlogDto } from './dto'

class BlogsRepository {
  constructor(private readonly DB: DB) {}

  public getAll = () => {
    return [...this.DB.blogs.values()]
  }

  public getById = (id: string) => {
    return this.DB.blogs.get(id)
  }

  public updateById = (id: string, body: UpdateBlogDto) => {
    const currentVideo = this.DB.blogs.get(id)

    if (!currentVideo) {
      return false
    }

    this.DB.blogs.set(id, { ...currentVideo, ...body })
    return true
  }

  public create = ({ name, description, websiteUrl }: CreateBlogDto) => {
    const newBlog = new Blog(name, description, websiteUrl)

    this.DB.blogs.set(newBlog.id, newBlog)
    return newBlog
  }

  public deleteById = (id: string) => {
    return this.DB.blogs.delete(id)
  }
}

export { BlogsRepository }
