import { NextFunction, Request, Response } from 'express'
import { IMiddleware } from '../../middleware.interface'
import { CommentExist } from '../../../comments/dto/params'
import { CommentsService } from '../../../comments'

class OwnerCommentMiddlewareGuard implements IMiddleware {
  constructor(private readonly commentsService: CommentsService) {}

  execute = async (
    { params, context }: Request<CommentExist>,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = params
    const { user } = context

    const comment = await this.commentsService.getById(id)

    if (user.id !== comment?.commentatorInfo.userId) {
      res.sendStatus(403)
      return
    }

    next()
  }
}

export { OwnerCommentMiddlewareGuard }
