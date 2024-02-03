import { NextFunction, Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../../types'
import { JwtService } from '../../../services'
import { UsersRepository } from '../../../users'

@injectable()
class AuthBearerMiddlewareGuard {
  constructor(
    @inject(TYPES.JwtService) private readonly jwtService: JwtService,
    @inject(TYPES.UsersRepository)
    private readonly usersRepository: UsersRepository
  ) {}

  async execute(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers

    const sendResponse = () => {
      res.sendStatus(401)
    }

    if (!authorization) {
      sendResponse()
      return
    }

    const [bearer, token] = authorization.split(' ')

    if (bearer !== 'Bearer' || !token) {
      sendResponse()
      return
    }

    const payload = this.jwtService.getJwtDataByToken(token)

    if (!payload?.userId) {
      sendResponse()
      return
    }

    const { userId, deviceId, iat, exp } = payload

    const user = await this.usersRepository.getById(userId)

    if (!user) {
      sendResponse()
      return
    }

    req.context = {
      user,
      token: {
        deviceId,
        iat,
        exp,
      },
    }

    next()
  }
}

export { AuthBearerMiddlewareGuard }
