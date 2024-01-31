import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TYPES } from '../types'
import { LikesModel } from './like.model'
import { ILikes, CommentInfoLikeType } from './interfaces'
import { BaseCommentLikeDto, LIKE_USER_STATUS_ENUM } from '../comments'

@injectable()
class LikesRepository {
  constructor(
    @inject(TYPES.LikesModel)
    private readonly likeModel: typeof LikesModel
  ) {}

  private _generateUpdateLikes(
    commentId: string,
    {
      addArr,
      removeArr,
    }: {
      addArr: CommentInfoLikeType<LIKE_USER_STATUS_ENUM>
      removeArr: CommentInfoLikeType<LIKE_USER_STATUS_ENUM>
    }
  ) {
    addArr.info.push({
      commentId: commentId,
      createdAt: new Date(),
    })

    const index = removeArr.info.findIndex(
      (info) => info.commentId === commentId
    )

    if (index !== -1) {
      removeArr.info.splice(index, 1)
    }
  }

  public async create(dto: ILikes) {
    const {
      likerInfo: { userId },
    } = dto

    const result = await this.likeModel.findOne({ 'likerInfo.userId': userId })

    if (!result) {
      return await this.likeModel.create(dto)
    }

    return result
  }

  public async getUserCommentLikesByUserId(userId: string) {
    return await this.likeModel
      .findOne({
        'likerInfo.userId': userId,
      })
      .select(['likeComments', 'dislikeComments'])
      .exec()
  }

  public async updateUserCommentLikes(
    dto: { commentId: string; userId: string } & BaseCommentLikeDto
  ) {
    const { commentId, userId, likeStatus } = dto

    const like = await this.likeModel
      .findOne({
        'likerInfo.userId': userId,
      })
      .select(['likeComments', 'dislikeComments'])

    if (!like) return null

    const { likeComments, dislikeComments } = like

    switch (likeStatus) {
      case LIKE_USER_STATUS_ENUM.Like:
        this._generateUpdateLikes(commentId, {
          addArr: likeComments,
          removeArr: dislikeComments,
        })
        break
      case LIKE_USER_STATUS_ENUM.Dislike:
        this._generateUpdateLikes(commentId, {
          addArr: dislikeComments,
          removeArr: likeComments,
        })
        break
      default:
        break
    }

    return await like.save()
  }
}

export { LikesRepository }
