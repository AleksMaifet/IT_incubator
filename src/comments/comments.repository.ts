import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TYPES } from '../types'
import { CommentModel } from './comment.model'
import { GetCommentsRequestQuery, IComments } from './interfaces'

@injectable()
class CommentsRepository {
  constructor(
    @inject(TYPES.CommentModel)
    private readonly commentModel: typeof CommentModel
  ) {}

  public create = async (dto: IComments) => {
    const comment = await this.commentModel.create(dto)

    return this._mapGenerateCommentResponse(comment)
  }

  public getById = async (id: string) => {
    const comment = await this.commentModel.findOne({ id }).exec()

    if (!comment) {
      return null
    }

    return this._mapGenerateCommentResponse(comment)
  }

  public getAllByPostId = async (dto: {
    postId: string
    query: GetCommentsRequestQuery<number>
  }) => {
    const { postId, query } = dto

    const totalCount = await this.commentModel.find({ postId }).countDocuments()

    const { response, findOptions } = this._createdFindOptionsAndResponse({
      ...query,
      totalCount,
    })

    const comments = await this.commentModel
      .find({ postId }, null, findOptions)
      .exec()

    response.items = comments.map(this._mapGenerateCommentResponse)

    return response
  }

  public updateById = async (dto: Pick<IComments, 'id' | 'content'>) => {
    const { id, content } = dto

    return await this.commentModel.updateOne({ id }, { content }).exec()
  }

  public deleteById = async (id: string) => {
    return await this.commentModel.deleteOne({ id }).exec()
  }

  private _mapGenerateCommentResponse = (comment: IComments) => {
    const { id, content, commentatorInfo, createdAt } = comment

    return {
      id,
      content,
      commentatorInfo,
      createdAt,
    }
  }

  private _createdFindOptionsAndResponse = (
    dto: GetCommentsRequestQuery<number> & {
      totalCount: number
    }
  ) => {
    const { totalCount, sortBy, sortDirection, pageNumber, pageSize } = dto

    const pagesCount = Math.ceil(totalCount / pageSize)
    const skip = (pageNumber - 1) * pageSize

    const findOptions = {
      limit: pageSize,
      skip: skip,
      sort: { [sortBy]: sortDirection },
    }

    const response: any = {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: [],
    }

    return { response, findOptions }
  }
}

export { CommentsRepository }
