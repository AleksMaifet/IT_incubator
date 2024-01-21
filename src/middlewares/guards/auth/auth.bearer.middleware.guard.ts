import { NextFunction, Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
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

  execute = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers

    const sendResponse = () => {
      res.sendStatus(401)
    }

    if (!authorization) {
      sendResponse()
      return
    }

    const [bearer, token] = authorization.split(' ')

    if (bearer !== 'Bearer') {
      sendResponse()
      return
    }

    const id = this.jwtService.getUserIdByToken(token)
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

export { AuthBearerMiddlewareGuard }
