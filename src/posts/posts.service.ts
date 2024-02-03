import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { BlogsRepository } from '../blogs'
import { PostsRepository } from './posts.repository'
import { CreatePostDto, UpdatePostDto } from './dto'
import { GetPostsRequestQuery } from './interfaces'
import { Post } from './post.entity'
import { DEFAULTS } from './constants'

const { SORT_DIRECTION, PAGE_NUMBER, PAGE_SIZE, SORT_BY } = DEFAULTS

@injectable()
class PostsService {
  constructor(
    @inject(TYPES.BlogsRepository)
    private readonly blogsRepository: BlogsRepository,
    @inject(TYPES.PostsRepository)
    private readonly postsRepository: PostsRepository
  ) {}

  private _mapQueryParamsToDB(query: GetPostsRequestQuery<string>) {
    const { sortBy, sortDirection, pageNumber, pageSize } = query

    const numPageNumber = Number(pageNumber)
    const numPageSize = Number(pageSize)
    const availablePageNumber =
      numPageNumber < PAGE_NUMBER ? PAGE_NUMBER : numPageNumber

    return {
      sortBy: sortBy ?? SORT_BY,
      sortDirection: SORT_DIRECTION[sortDirection!] ?? SORT_DIRECTION.desc,
      pageNumber: (isFinite(numPageNumber)
        ? availablePageNumber
        : PAGE_NUMBER) as number,
      pageSize: (isFinite(numPageSize) ? numPageSize : PAGE_SIZE) as number,
    }
  }

  public async getAll(query: GetPostsRequestQuery<string>) {
    const dto = this._mapQueryParamsToDB(query)

    return await this.postsRepository.getAll(dto)
  }

  public async getById(id: string) {
    return await this.postsRepository.getById(id)
  }

  public async updateById(id: string, dto: UpdatePostDto) {
    return await this.postsRepository.updateById(id, dto)
  }

  public async create({
    title,
    shortDescription,
    content,
    blogId,
  }: CreatePostDto) {
    const blog = await this.blogsRepository.getById(blogId)

    const newPost = new Post(
      title,
      shortDescription,
      content,
      blogId,
      blog!.name
    )

    return await this.postsRepository.create(newPost)
  }

  public async deleteById(id: string) {
    return await this.postsRepository.deleteById(id)
  }
}

export { PostsService }
