import { NextFunction, Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../types'
import { JwtService } from '../../services'
import { UsersRepository } from '../../users'
import { REFRESH_TOKEN_COOKIE_NAME } from '../../auth'

@injectable()
class AuthUserMiddleware {
  constructor(
    @inject(TYPES.JwtService) private readonly jwtService: JwtService,
    @inject(TYPES.UsersRepository)
    private readonly usersRepository: UsersRepository
  ) {}

  async execute(req: Request, _: Response, next: NextFunction) {
    const { authorization } = req.headers

    if (!authorization) {
      next()

      return
    }

    const [__, token] = authorization.split(' ')

    const payload = this.jwtService.getJwtDataByToken(token)

    const { userId, deviceId, iat, exp } = payload

    const user = await this.usersRepository.getById(userId)

    req.context = {
      user: user!,
      token: {
        deviceId,
        iat,
        exp,
      },
    }

    next()
  }
}

export { AuthUserMiddleware }
