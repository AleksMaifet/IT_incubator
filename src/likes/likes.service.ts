import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { BaseCommentLikeDto } from '../comments'
import { BasePostLikeDto } from '../posts'
import { Likes } from './like.entity'
import { LikesRepository } from './likes.repository'

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

  public async getUserLikesByUserId(userId: string) {
    return await this.likesRepository.getUserLikesByUserId(userId)
  }

  public async updateUserCommentLikes(
    dto: { commentId: string; userId: string } & BaseCommentLikeDto
  ) {
    return await this.likesRepository.updateUserCommentLikes(dto)
  }

  public async updateUserPostLikes(
    dto: { postId: string; userId: string } & BasePostLikeDto
  ) {
    return await this.likesRepository.updateUserPostLikes(dto)
  }
}

export { LikesService }
