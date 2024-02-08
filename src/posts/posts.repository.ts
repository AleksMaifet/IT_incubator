import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { BasePostLikeDto, CreatePostDto, UpdatePostDto } from './dto'
import { PostModel } from './post.model'
import {
  GetPostsRequestQuery,
  IPostsResponse,
  LIKE_POST_USER_STATUS_ENUM,
  IUserPostLike,
} from './interfaces'
import { DEFAULTS_LIKE_STATUS } from './constants'

const { LIKES_COUNT, DISLIKES_COUNT, MAX_NEWEST_LIKES_COUNT } =
  DEFAULTS_LIKE_STATUS

@injectable()
class PostsRepository {
  constructor(
    @inject(TYPES.PostModel)
    private readonly postModel: typeof PostModel
  ) {}

  public async getAll(dto: GetPostsRequestQuery<number>) {
    const { sortBy, sortDirection, pageNumber, pageSize } = dto

    const totalCount = await this.postModel.countDocuments()
    const pagesCount = Math.ceil(totalCount / pageSize)
    const skip = (pageNumber - 1) * pageSize

    const findOptions = {
      limit: pageSize,
      skip: skip,
      sort: { [sortBy]: sortDirection },
    }

    const response: IPostsResponse = {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: [],
    }

    response.items = await this.postModel.find({}, null, findOptions).exec()

    return response
  }

  public async updateLikeWithStatusLikeOrDislike(
    dto: {
      postId: string
      isFirstTime: boolean
      userLikeInfo: IUserPostLike
    } & BasePostLikeDto
  ) {
    const { postId, likeStatus, isFirstTime, userLikeInfo } = dto

    const post = await this.postModel.findOne({ id: postId })
    const currentPost = post!
    const { extendedLikesInfo } = currentPost

    switch (likeStatus) {
      case LIKE_POST_USER_STATUS_ENUM.None:
        extendedLikesInfo.likesCount = LIKES_COUNT
        extendedLikesInfo.dislikesCount = DISLIKES_COUNT
        break
      case LIKE_POST_USER_STATUS_ENUM.Like:
        extendedLikesInfo.likesCount += 1

        if (extendedLikesInfo.newestLikes.length >= MAX_NEWEST_LIKES_COUNT) {
          extendedLikesInfo.newestLikes.shift()
        }

        extendedLikesInfo.newestLikes.push(userLikeInfo)

        if (isFirstTime) {
          break
        }

        extendedLikesInfo.dislikesCount -= 1

        break
      case LIKE_POST_USER_STATUS_ENUM.Dislike:
        extendedLikesInfo.dislikesCount += 1

        if (isFirstTime) {
          break
        }

        extendedLikesInfo.likesCount -= 1

        break
      default:
        break
    }

    return await currentPost.save()
  }

  public async getById(id: string) {
    return await this.postModel.findOne({ id }).exec()
  }

  public async updateById(id: string, dto: UpdatePostDto) {
    return await this.postModel.updateOne({ id }, dto).exec()
  }

  public async create(dto: CreatePostDto) {
    return await this.postModel.create(dto)
  }

  public async deleteById(id: string) {
    return await this.postModel.deleteOne({ id }).exec()
  }
}

export { PostsRepository }
