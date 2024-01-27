import { NextFunction, Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TYPES } from '../../../types'
import { JwtService } from '../../../services'
import { UsersRepository } from '../../../users'
import { REFRESH_TOKEN_COOKIE_NAME } from '../../../auth'
import { IMiddleware } from '../../middleware.interface'

@injectable()
class AuthRefreshTokenMiddlewareGuard implements IMiddleware {
  constructor(
    @inject(TYPES.JwtService) private readonly jwtService: JwtService,
    @inject(TYPES.UsersRepository)
    private readonly usersRepository: UsersRepository
  ) {}

  execute = async (req: Request, res: Response, next: NextFunction) => {
    const { cookies } = req

    const refreshToken = cookies[REFRESH_TOKEN_COOKIE_NAME]

    const sendResponse = () => {
      res.sendStatus(401)
    }

    if (!refreshToken) {
      sendResponse()
      return
    }

    const payload = this.jwtService.getJwtDataByToken(refreshToken)

    if (!payload?.userId) {
      sendResponse()
      return
    }

    const user = await this.usersRepository.getById(payload.userId)

    if (!user) {
      sendResponse()
      return
    }

    req.context = {
      user,
    }

    next()
  }
}

export { AuthRefreshTokenMiddlewareGuard }