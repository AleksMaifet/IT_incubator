import { DB } from '../db'
import { Post } from './post.entity'
import { CreatePostDto, UpdatePostDto } from './dto'

class PostsRepository {
  constructor(private readonly DB: DB) {}

  public getAll = () => {
    return [...this.DB.posts.values()]
  }

  public getById = (id: string) => {
    return this.DB.posts.get(id)
  }

  public updateById = (id: string, body: UpdatePostDto) => {
    const currentVideo = this.DB.posts.get(id)

    if (!currentVideo) {
      return false
    }

    this.DB.posts.set(id, { ...currentVideo, ...body })
    return true
  }

  public create = ({
    title,
    shortDescription,
    content,
    blogId,
  }: CreatePostDto) => {
    const blog = this.DB.blogs.get(blogId)
    const newPost = new Post(
      title,
      shortDescription,
      content,
      blogId,
      blog?.name as string
    )

    this.DB.posts.set(newPost.id, newPost)
    return newPost
  }

  public deleteById = (id: string) => {
    return this.DB.posts.delete(id)
  }
}

export { PostsRepository }
