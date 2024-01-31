import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TYPES } from '../types'
import { CommentInfoLikeType, LikesService } from '../likes'
import { CommentsRepository } from './comments.repository'
import {
  GetCommentsRequestQuery,
  IComments,
  ICommentsResponse,
  LIKE_USER_STATUS_ENUM,
} from './interfaces'
import { Comment } from './comment.entity'
import { DEFAULTS } from './constants'
import { BaseCommentLikeDto } from './dto'

const { SORT_DIRECTION, PAGE_NUMBER, PAGE_SIZE, SORT_BY } = DEFAULTS

@injectable()
class CommentsService {
  constructor(
    @inject(TYPES.CommentsRepository)
    private readonly commentsRepository: CommentsRepository,
    @inject(TYPES.LikesService)
    private readonly likesService: LikesService
  ) {}

  private _mapGenerateLikeResponse(
    comments: ICommentsResponse,
    {
      likeComments,
      dislikeComments,
    }: {
      likeComments: CommentInfoLikeType<LIKE_USER_STATUS_ENUM.Like>
      dislikeComments: CommentInfoLikeType<LIKE_USER_STATUS_ENUM.Dislike>
    }
  ) {
    const commentsStash: Record<string, number> = {}

    comments.items.forEach((item, index) => {
      commentsStash[item.id] = index
    })

    likeComments.info.forEach((l) => {
      const currentId = l.commentId

      if (commentsStash[currentId] !== undefined) {
        const currentIndex = commentsStash[currentId]

        comments.items[currentIndex].likesInfo = {
          ...comments.items[currentIndex].likesInfo,
          myStatus: likeComments.status,
        }
      }
    })

    dislikeComments.info.forEach((l) => {
      const currentId = l.commentId

      if (commentsStash[currentId] !== undefined) {
        const currentIndex = commentsStash[currentId]

        comments.items[currentIndex].likesInfo = {
          ...comments.items[currentIndex].likesInfo,
          myStatus: dislikeComments.status,
        }
      }
    })

    return comments
  }

  private _mapQueryParamsToDB(query: GetCommentsRequestQuery<string>) {
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

  public async create(
    dto: Pick<IComments, 'content' | 'commentatorInfo'> & { postId: string }
  ) {
    const { postId, content, commentatorInfo } = dto

    const newComment = new Comment(postId, content, commentatorInfo)

    return await this.commentsRepository.create(newComment)
  }

  public async getAllByPostId({
    postId,
    query,
    userId,
  }: {
    postId: string
    userId: string
    query: GetCommentsRequestQuery<string>
  }) {
    const dto = this._mapQueryParamsToDB(query)

    const likes = await this.likesService.getUserCommentLikesByUserId(userId)

    if (!likes) return null

    const { likeComments, dislikeComments } = likes

    const comments = await this.commentsRepository.getAllByPostId({
      postId,
      query: dto,
    })

    return this._mapGenerateLikeResponse(comments, {
      likeComments,
      dislikeComments,
    })
  }

  public async getById({ id, userId }: { id: string; userId: string }) {
    const comment = await this.commentsRepository.getById(id)
    if (!comment) return null

    const likes = await this.likesService.getUserCommentLikesByUserId(userId)
    if (!likes) return null

    likes.likeComments.info.forEach((l) => {
      if (l.commentId === comment.id) {
        comment.likesInfo = {
          ...comment.likesInfo,
          myStatus: likes.likeComments.status,
        }
      }
    })

    likes.dislikeComments.info.forEach((l) => {
      if (l.commentId === comment.id) {
        comment.likesInfo = {
          ...comment.likesInfo,
          myStatus: likes.dislikeComments.status,
        }
      }
    })

    return comment
  }

  public async updateLikeById(
    dto: { commentId: string; userId: string } & BaseCommentLikeDto
  ) {
    const { commentId, likeStatus, userId } = dto

    const result = await this.likesService.getUserCommentLikesByUserId(userId)

    const { likeComments, dislikeComments } = result!

    switch (likeStatus) {
      case LIKE_USER_STATUS_ENUM.Like:
        {
          const index = likeComments.info.findIndex(
            (info) => info.commentId === commentId
          )

          if (index !== -1) {
            return
          }
        }
        break
      case LIKE_USER_STATUS_ENUM.Dislike:
        {
          const index = dislikeComments.info.findIndex(
            (info) => info.commentId === commentId
          )

          if (index !== -1) {
            return
          }
        }
        break
      default:
        break
    }

    await this.likesService.updateUserCommentLikes({
      userId,
      likeStatus,
      commentId,
    })

    await this.commentsRepository.updateLikeById({
      likeStatus,
      commentId,
    })

    return true
  }

  public async updateById(dto: Pick<IComments, 'id' | 'content'>) {
    return await this.commentsRepository.updateById(dto)
  }

  public async deleteById(id: string) {
    return await this.commentsRepository.deleteById(id)
  }
}

export { CommentsService }
