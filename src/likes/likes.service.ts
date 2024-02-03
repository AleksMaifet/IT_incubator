import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { LikesRepository } from './likes.repository'
import { Likes } from './like.entity'
import { BaseCommentLikeDto } from '../comments'

@injectable()
class LikesService {
  constructor(
    @inject(TYPES.LikesRepository)
    private readonly likesRepository: LikesRepository
  ) {}

  public async create(dto: { userId: string; userLogin: string }) {
    const likes = new Likes(dto)

    return await this.likesRepository.create(likes)
  }

  public async getUserCommentLikesByUserId(userId: string) {
    return await this.likesRepository.getUserCommentLikesByUserId(userId)
  }

  public async updateUserCommentLikes(
    dto: { commentId: string; userId: string } & BaseCommentLikeDto
  ) {
    return await this.likesRepository.updateUserCommentLikes(dto)
  }
}

export { LikesService }
