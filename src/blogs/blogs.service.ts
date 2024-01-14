import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { BlogsRepository } from './blogs.repository'
import { CreateBlogDto, UpdateBlogDto } from './dto/body'
import { Blog } from './blog.entity'
import { GetBlogsRequestQuery } from './interfaces'
import { DEFAULTS } from './constants'
import { TYPES } from '../types'

const { SORT_DIRECTION, PAGE_NUMBER, PAGE_SIZE, SORT_BY } = DEFAULTS

@injectable()
class BlogsService {
  constructor(
    @inject(TYPES.BlogsRepository)
    private readonly blogsRepository: BlogsRepository
  ) {}

  public getAll = async (query: GetBlogsRequestQuery<string>) => {
    const dto = this._mapQueryParamsToDB(query)

    return await this.blogsRepository.getAll(dto)
  }

  public getById = async (id: string) => {
    return await this.blogsRepository.getById(id)
  }

  public getPostsByBlogId = async (
    id: string,
    query: Omit<GetBlogsRequestQuery<string>, 'searchNameTerm'>
  ) => {
    const dto = this._mapQueryParamsToDB(query)

    return await this.blogsRepository.getPostsByBlogId(id, dto)
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

  private _mapQueryParamsToDB = (query: GetBlogsRequestQuery<string>) => {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      query

    const numPageNumber = Number(pageNumber)
    const numPageSize = Number(pageSize)

    return {
      searchNameTerm: searchNameTerm ?? 'null',
      sortBy: sortBy ?? SORT_BY,
      sortDirection: SORT_DIRECTION[sortDirection!] ?? SORT_DIRECTION.desc,
      pageNumber: isFinite(numPageNumber)
        ? Math.max(numPageNumber, PAGE_NUMBER)
        : PAGE_NUMBER,
      pageSize: isFinite(numPageSize) ? numPageSize : PAGE_SIZE,
    }
  }
}

export { BlogsService }
