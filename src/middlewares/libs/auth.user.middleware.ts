import { NextFunction, Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../types'
import { JwtService } from '../../services'
import { UsersRepository } from '../../users'

@injectable()
class AuthUserMiddleware {
  constructor(
    @inject(TYPES.JwtService) private readonly jwtService: JwtService,
    @inject(TYPES.UsersRepository)
    private readonly usersRepository: UsersRepository
  ) {}

  async execute(req: Request, _: Response, next: NextFunction) {
    const { authorization } = req.headers

    const [__, token] = authorization!.split(' ')

    const payload = this.jwtService.getJwtDataByToken(token)

    if (!payload) {
      return
    }

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
