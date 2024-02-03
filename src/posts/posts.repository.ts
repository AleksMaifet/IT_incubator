import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { CreatePostDto, UpdatePostDto } from './dto'
import { PostModel } from './post.model'
import { GetPostsRequestQuery, IPostsResponse } from './interfaces'

@injectable()
class PostsRepository {
  constructor(
    @inject(TYPES.PostModel)
    private readonly postModel: typeof PostModel
  ) {}

  public async getAll(dto: GetPostsRequestQuery<number>) {
    const { sortBy, sortDirection, pageNumber, pageSize } = dto

    const totalCount = await this.postModel.countDocuments()
    const pagesCount = Math.ceil(totalCount / pageSize)
    const skip = (pageNumber - 1) * pageSize

    const findOptions = {
      limit: pageSize,
      skip: skip,
      sort: { [sortBy]: sortDirection },
    }

    const response: IPostsResponse = {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: [],
    }

    response.items = await this.postModel.find({}, null, findOptions).exec()

    return response
  }

  public async getById(id: string) {
    return await this.postModel.findOne({ id }).exec()
  }

  public async updateById(id: string, dto: UpdatePostDto) {
    return await this.postModel.updateOne({ id }, dto).exec()
  }

  public async create(dto: CreatePostDto) {
    return await this.postModel.create(dto)
  }

  public async deleteById(id: string) {
    return await this.postModel.deleteOne({ id }).exec()
  }
}

export { PostsRepository }
