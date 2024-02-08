import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { BlogsRepository } from '../blogs'
import { LikesService, PostInfoLikeType } from '../likes'
import { LIKE_COMMENT_USER_STATUS_ENUM } from '../comments'
import { IUser } from '../users'
import { PostsRepository } from './posts.repository'
import { BasePostLikeDto, CreatePostDto, UpdatePostDto } from './dto'
import {
  GetPostsRequestQuery,
  IPostsResponse,
  LIKE_POST_USER_STATUS_ENUM,
} from './interfaces'
import { Post, UserLikeInfoEntity } from './entities'
import { DEFAULTS } from './constants'

const { SORT_DIRECTION, PAGE_NUMBER, PAGE_SIZE, SORT_BY } = DEFAULTS

@injectable()
class PostsService {
  constructor(
    @inject(TYPES.LikesService)
    private readonly likesService: LikesService,
    @inject(TYPES.BlogsRepository)
    private readonly blogsRepository: BlogsRepository,
    @inject(TYPES.PostsRepository)
    private readonly postsRepository: PostsRepository
  ) {}

  private _mapGenerateLikeResponse(
    posts: IPostsResponse,
    likeStatusPosts: PostInfoLikeType<LIKE_POST_USER_STATUS_ENUM>[]
  ) {
    const stash: Record<string, number> = {}

    posts.items.forEach((item, index) => {
      stash[item.id] = index
    })

    likeStatusPosts.forEach((l) => {
      const currentId = l.postId

      if (currentId in stash) {
        const currentIndex = stash[currentId]

        posts.items[currentIndex].extendedLikesInfo = {
          ...posts.items[currentIndex].extendedLikesInfo,
          myStatus: l.status ?? LIKE_COMMENT_USER_STATUS_ENUM.None,
        }
      }
    })

    return posts
  }

  private _mapQueryParamsToDB(query: GetPostsRequestQuery<string>) {
    const { sortBy, sortDirection, pageNumber, pageSize } = query

    const numPageNumber = Number(pageNumber)
    const numPageSize = Number(pageSize)
    const availablePageNumber =
      numPageNumber < PAGE_NUMBER ? PAGE_NUMBER : numPageNumber

    return {
      sortBy: sortBy ?? SORT_BY,
      sortDirection: SORT_DIRECTION[sortDirection!] ?? SORT_DIRECTION.desc,
      pageNumber: (isFinite(numPageNumber)
        ? availablePageNumber
        : PAGE_NUMBER) as number,
      pageSize: (isFinite(numPageSize) ? numPageSize : PAGE_SIZE) as number,
    }
  }

  public async updateLikeById(
    dto: {
      postId: string
      user: Omit<IUser, 'passwordSalt' | 'passwordHash'>
    } & BasePostLikeDto
  ) {
    const {
      postId,
      likeStatus,
      user: { id, login },
    } = dto

    const newUserLikeInfo = new UserLikeInfoEntity(id, login)

    const { likeStatusPosts } = await this.likesService.create({
      userId: id,
      userLogin: login,
    })

    if (!likeStatusPosts) return

    const isExist = likeStatusPosts.findIndex(
      (info) => info.postId === postId && info.status === likeStatus
    )

    const isFirst = likeStatusPosts.findIndex((info) => info.postId === postId)

    if (isExist !== -1) {
      return
    }

    await this.likesService.updateUserPostLikes({
      userId: id,
      likeStatus,
      postId,
    })

    await this.postsRepository.updateLikeWithStatusLikeOrDislike({
      isFirstTime: isFirst === -1,
      likeStatus,
      postId,
      userLikeInfo: newUserLikeInfo,
    })

    return true
  }

  public async getAll({
    userId,
    query,
  }: {
    userId: string
    query: GetPostsRequestQuery<string>
  }) {
    const dto = this._mapQueryParamsToDB(query)

    const posts = await this.postsRepository.getAll(dto)

    if (!userId) {
      return posts
    }

    const likes = await this.likesService.getUserLikesByUserId(userId)

    if (!likes) {
      return posts
    }

    const { likeStatusPosts } = likes

    return this._mapGenerateLikeResponse(posts, likeStatusPosts)
  }

  public async getById({ id, userId }: { id: string; userId: string }) {
    const post = await this.postsRepository.getById(id)

    if (!post) return null

    if (!userId) {
      return post
    }

    const likes = await this.likesService.getUserLikesByUserId(userId)

    if (!likes) {
      return post
    }

    likes.likeStatusPosts.forEach((l) => {
      if (l.postId === post.id) {
        post.extendedLikesInfo = {
          ...post.extendedLikesInfo,
          myStatus: l.status,
        }
      }
    })

    return post
  }

  public async getPostsByBlogId({
    id,
    userId,
    query,
  }: {
    id: string
    userId: string
    query: GetPostsRequestQuery<string>
  }) {
    const dto = this._mapQueryParamsToDB(query)

    const posts = await this.postsRepository.getPostsByBlogId(id, dto)

    if (!userId) {
      return posts
    }

    const likes = await this.likesService.getUserLikesByUserId(userId)

    if (!likes) {
      return posts
    }

    const { likeStatusPosts } = likes

    return this._mapGenerateLikeResponse(posts, likeStatusPosts)
  }

  public async updateById(id: string, dto: UpdatePostDto) {
    return await this.postsRepository.updateById(id, dto)
  }

  public async create({
    title,
    shortDescription,
    content,
    blogId,
  }: CreatePostDto) {
    const blog = await this.blogsRepository.getById(blogId)

    const newPost = new Post(
      title,
      shortDescription,
      content,
      blogId,
      blog!.name
    )

    return await this.postsRepository.create(newPost)
  }

  public async deleteById(id: string) {
    return await this.postsRepository.deleteById(id)
  }
}

export { PostsService }
