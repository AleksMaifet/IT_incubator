import { NextFunction, Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { IMiddleware } from '../../middleware.interface'
import { TYPES } from '../../../types'
import { REFRESH_TOKEN_COOKIE_NAME } from '../../../auth'
import { BlackListTokenRepository } from '../../../repositories'

@injectable()
class AuthInvalidRefreshedTokenMiddlewareGuard implements IMiddleware {
  constructor(
    @inject(TYPES.BlackListTokenRepository)
    private readonly blackListTokenRepository: BlackListTokenRepository
  ) {}

  execute = async (req: Request, res: Response, next: NextFunction) => {
    const { cookies } = req

    const refreshToken = cookies[REFRESH_TOKEN_COOKIE_NAME]

    const refreshedToken =
      await this.blackListTokenRepository.getRefreshedToken(refreshToken)

    if (refreshedToken) {
      res.sendStatus(401)
      return
    }

    next()
  }
}

export { AuthInvalidRefreshedTokenMiddlewareGuard }
