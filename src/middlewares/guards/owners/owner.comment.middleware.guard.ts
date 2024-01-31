import { NextFunction, Request, Response } from 'express'
import { IMiddleware } from '../../middleware.interface'
import { CommentExist, CommentsService } from '../../../comments'

class OwnerCommentMiddlewareGuard implements IMiddleware {
  constructor(private readonly commentsService: CommentsService) {}

  async execute(
    { params, context }: Request<CommentExist>,
    res: Response,
    next: NextFunction
  ) {
    const { id } = params
    const { user } = context

    const comment = await this.commentsService.getById({ id, userId: user.id })

    if (user.id !== comment?.commentatorInfo.userId) {
      res.sendStatus(403)
      return
    }

    next()
  }
}

export { OwnerCommentMiddlewareGuard }
