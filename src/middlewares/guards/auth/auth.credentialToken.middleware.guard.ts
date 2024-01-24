import { NextFunction, Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { IMiddleware } from '../../middleware.interface'
import { TYPES } from '../../../types'
import { JwtService } from '../../../services'
import { REFRESH_TOKEN_COOKIE_NAME } from '../../../auth'
import { UsersRepository } from '../../../users'
import { BlackListRefreshTokenRepository } from '../../../repositories'

@injectable()
class AuthCredentialTokenMiddlewareGuard implements IMiddleware {
  constructor(
    @inject(TYPES.JwtService) private readonly jwtService: JwtService,
    @inject(TYPES.UsersRepository)
    private readonly usersRepository: UsersRepository,
    @inject(TYPES.BlackListRefreshTokenRepository)
    private readonly blackListRefreshTokenRepository: BlackListRefreshTokenRepository
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

    const expiredRefreshToken =
      await this.blackListRefreshTokenRepository.getExpiredRefreshToken(
        refreshToken
      )

    if (expiredRefreshToken) {
      sendResponse()
      return
    }

    const id = this.jwtService.getUserIdByToken(refreshToken)

    if (!id) {
      await this.blackListRefreshTokenRepository.createExpiredRefreshToken(
        refreshToken
      )

      sendResponse()
      return
    }

    const user = await this.usersRepository.getById(id)

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

export { AuthCredentialTokenMiddlewareGuard }
