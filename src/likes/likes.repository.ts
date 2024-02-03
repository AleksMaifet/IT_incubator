import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { LikesModel } from './like.model'
import { ILikes } from './interfaces'
import { BaseCommentLikeDto } from '../comments'

@injectable()
class LikesRepository {
  constructor(
    @inject(TYPES.LikesModel)
    private readonly likeModel: typeof LikesModel
  ) {}

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
      .select('likeStatusComments')
      .exec()
  }

  public async updateUserCommentLikes(
    dto: { commentId: string; userId: string } & BaseCommentLikeDto
  ) {
    const { commentId, userId, likeStatus } = dto

    const like = await this.likeModel.findOne({
      'likerInfo.userId': userId,
    })

    if (!like) return null

    const { likeStatusComments } = like

    const index = likeStatusComments.findIndex(
      (info) => info.commentId === commentId
    )

    if (index !== -1) {
      likeStatusComments.splice(index, 1)
    }

    likeStatusComments.push({
      status: likeStatus,
      commentId,
      createdAt: new Date(),
    })

    return await like.save()
  }
}

export { LikesRepository }
