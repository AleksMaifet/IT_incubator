import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { CreateBlogDto, UpdateBlogDto } from './dto/body'
import { BlogModel } from './blog.model'
import { GetBlogsRequestQuery, IBlogsResponse } from './interfaces'
import { PostModel } from '../posts'
import { TYPES } from '../types'

@injectable()
class BlogsRepository {
  constructor(
    @inject(TYPES.BlogModel)
    private readonly blogModel: typeof BlogModel,
    @inject(TYPES.PostModel)
    private readonly postModel: typeof PostModel
  ) {}

  private createdFindOptionsAndResponse = async <T>(
    dto: Omit<
      GetBlogsRequestQuery<number> & {
        totalCount: number
      },
      'searchNameTerm'
    >
  ) => {
    const { totalCount, sortBy, sortDirection, pageNumber, pageSize } = dto

    const pagesCount = Math.ceil(totalCount / pageSize)
    const skipBlogs = (pageNumber - 1) * pageSize

    const findOptions = {
      limit: pageSize,
      skip: skipBlogs,
      sort: { [sortBy]: sortDirection },
    }

    const blogsResponse: IBlogsResponse & {
      items: T[]
    } = {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: [],
    }

    return { blogsResponse, findOptions }
  }

  public getAll = async (dto: GetBlogsRequestQuery<number>) => {
    const { searchNameTerm, ...rest } = dto

    const totalCount = await this.blogModel.countDocuments()

    const { blogsResponse, findOptions } =
      await this.createdFindOptionsAndResponse({ ...rest, totalCount })

    if (searchNameTerm === 'null' || !searchNameTerm) {
      blogsResponse.items = await this.blogModel
        .find({}, null, findOptions)
        .exec()
      return blogsResponse
    }

    const regex = new RegExp(searchNameTerm, 'i')

    blogsResponse.items = await this.blogModel
      .find({ name: { $regex: regex } }, null, findOptions)
      .exec()
    return blogsResponse
  }

  public getById = async (id: string) => {
    return await this.blogModel.findOne({ id }).exec()
  }

  public getPostsByBlogId = async (
    id: string,
    query: Omit<GetBlogsRequestQuery<number>, 'searchNameTerm'>
  ) => {
    const totalCount = await this.postModel
      .find({ blogId: id })
      .countDocuments()

    const { blogsResponse, findOptions } =
      await this.createdFindOptionsAndResponse({ ...query, totalCount })

    blogsResponse.items = await this.postModel
      .find({ blogId: id }, null, findOptions)
      .exec()

    return blogsResponse
  }

  public updateById = async (id: string, dto: UpdateBlogDto) => {
    return await this.blogModel.updateOne({ id }, dto).exec()
  }

  public create = async (dto: CreateBlogDto) => {
    return await this.blogModel.create(dto)
  }

  public deleteById = async (id: string) => {
    return await this.blogModel.deleteOne({ id }).exec()
  }
}

export { BlogsRepository }
