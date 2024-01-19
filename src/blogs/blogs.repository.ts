import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { CreateBlogDto, UpdateBlogDto } from './dto/body'
import { BlogModel } from './blog.model'
import { GetBlogsRequestQuery, IBlog, IBlogsResponse } from './interfaces'
import { PostModel } from '../posts'
import { TYPES } from '../types'
import { IPost } from '../posts/interfaces'

@injectable()
class BlogsRepository {
  constructor(
    @inject(TYPES.BlogModel)
    private readonly blogModel: typeof BlogModel,
    @inject(TYPES.PostModel)
    private readonly postModel: typeof PostModel
  ) {}

  private getAllBySearchNameTerm = async (
    dto: GetBlogsRequestQuery<number>
  ) => {
    const { searchNameTerm, ...rest } = dto

    const regex = new RegExp(searchNameTerm!, 'i')
    const totalCount = await this.blogModel
      .find({ name: { $regex: regex } })
      .countDocuments()

    const { response, findOptions } = this.createdFindOptionsAndResponse<IBlog>(
      {
        ...rest,
        totalCount,
      }
    )

    response.items = await this.blogModel
      .find({ name: { $regex: regex } }, null, findOptions)
      .exec()

    return response
  }

  private getAllWithoutSearchNameTerm = async (
    dto: Omit<GetBlogsRequestQuery<number>, 'searchNameTerm'>
  ) => {
    const totalCount = await this.blogModel.countDocuments()

    const { response, findOptions } = this.createdFindOptionsAndResponse<IBlog>(
      {
        ...dto,
        totalCount,
      }
    )

    response.items = await this.blogModel.find({}, null, findOptions).exec()

    return response
  }

  private createdFindOptionsAndResponse = <T>(
    dto: Omit<
      GetBlogsRequestQuery<number> & {
        totalCount: number
      },
      'searchNameTerm'
    >
  ) => {
    const { totalCount, sortBy, sortDirection, pageNumber, pageSize } = dto

    const pagesCount = Math.ceil(totalCount / pageSize)
    const skip = (pageNumber - 1) * pageSize

    const findOptions = {
      limit: pageSize,
      skip: skip,
      sort: { [sortBy]: sortDirection },
    }

    const response: IBlogsResponse<T> = {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: [],
    }

    return { response, findOptions }
  }

  public getAll = async (dto: GetBlogsRequestQuery<number>) => {
    const { searchNameTerm, ...rest } = dto

    if (searchNameTerm === 'null') {
      return await this.getAllWithoutSearchNameTerm(rest)
    }

    return await this.getAllBySearchNameTerm(dto)
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

    const { response, findOptions } = this.createdFindOptionsAndResponse<IPost>(
      {
        ...query,
        totalCount,
      }
    )

    response.items = await this.postModel
      .find({ blogId: id }, null, findOptions)
      .exec()

    return response
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
