import { BlogsRepository } from '../blogs'
import { PostsRepository } from './posts.repository'
import { CreatePostDto, UpdatePostDto } from './dto'
import { Post } from './post.entity'

class PostsService {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository
  ) {}

  public getAll = async () => {
    return await this.postsRepository.getAll()
  }

  public getById = async (id: string) => {
    return await this.postsRepository.getById(id)
  }

  public updateById = async (id: string, dto: UpdatePostDto) => {
    return await this.postsRepository.updateById(id, dto)
  }

  public create = async ({
    title,
    shortDescription,
    content,
    blogId,
  }: CreatePostDto) => {
    const blog = await this.blogsRepository.getById(blogId)

    const newPost = new Post(
      title,
      shortDescription,
      content,
      blogId,
      blog?.name as string
    )

    return await this.postsRepository.create(newPost)
  }

  public deleteById = async (id: string) => {
    return await this.postsRepository.deleteById(id)
  }
}

export { PostsService }
