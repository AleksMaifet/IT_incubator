import { BlogModel } from '../blogs'
import { Post } from './post.entity'
import { CreatePostDto, UpdatePostDto } from './dto'
import { PostModel } from './post.model'

class PostsRepository {
  constructor(
    private readonly blogModel: typeof BlogModel,
    private readonly postModel: typeof PostModel
  ) {}

  public getAll = async () => {
    return await this.postModel.find().exec()
  }

  public getById = async (id: string) => {
    return await this.postModel.findOne({ id }).exec()
  }

  public updateById = async (id: string, body: UpdatePostDto) => {
    return await this.postModel.findOneAndUpdate({ id }, body).exec()
  }

  public create = async ({
    title,
    shortDescription,
    content,
    blogId,
  }: CreatePostDto) => {
    const blog = await this.blogModel.findOne({ id: blogId })

    const newPost = new Post(
      title,
      shortDescription,
      content,
      blogId,
      blog?.name as string
    )

    return await this.postModel.create(newPost)
  }

  public deleteById = async (id: string) => {
    return await this.postModel.findOneAndDelete({ id }).exec()
  }
}

export { PostsRepository }
