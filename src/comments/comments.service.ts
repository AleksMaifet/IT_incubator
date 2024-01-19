import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TYPES } from '../types'
import { CommentsRepository } from './comments.repository'
import { GetCommentsRequestQuery, IComments } from './interfaces'
import { Comment } from './comment.entity'
import { DEFAULTS } from './constants'

const { SORT_DIRECTION, PAGE_NUMBER, PAGE_SIZE, SORT_BY } = DEFAULTS

@injectable()
class CommentsService {
  constructor(
    @inject(TYPES.CommentsRepository)
    private readonly commentsRepository: CommentsRepository
  ) {}

  public create = async (
    dto: Pick<IComments, 'content' | 'commentatorInfo'> & { postId: string }
  ) => {
    const { postId, content, commentatorInfo } = dto

    const newComment = new Comment(postId, content, commentatorInfo)

    return await this.commentsRepository.create(newComment)
  }

  public getAllByPostId = async ({
    postId,
    query,
  }: {
    postId: string
    query: GetCommentsRequestQuery<string>
  }) => {
    const dto = this._mapQueryParamsToDB(query)

    return await this.commentsRepository.getAllByPostId({ postId, query: dto })
  }

  public getById = async (id: string) => {
    return await this.commentsRepository.getById(id)
  }

  public updateById = async (dto: Pick<IComments, 'id' | 'content'>) => {
    return await this.commentsRepository.updateById(dto)
  }

  public deleteById = async (id: string) => {
    return await this.commentsRepository.deleteById(id)
  }

  private _mapQueryParamsToDB = (query: GetCommentsRequestQuery<string>) => {
    const { sortBy, sortDirection, pageNumber, pageSize } = query

    const numPageNumber = Number(pageNumber)
    const numPageSize = Number(pageSize)

    return {
      sortBy: sortBy ?? SORT_BY,
      sortDirection: SORT_DIRECTION[sortDirection] ?? SORT_DIRECTION.desc,
      pageNumber: isFinite(numPageNumber)
        ? Math.max(numPageNumber, PAGE_NUMBER)
        : PAGE_NUMBER,
      pageSize: isFinite(numPageSize) ? numPageSize : PAGE_SIZE,
    }
  }
}

export { CommentsService }
