import { NextFunction, Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { IMiddleware } from '../middleware.interface'
import { TYPES } from '../../types'
import { ConfigService } from '../../services'

@injectable()
class AuthMiddlewareGuard implements IMiddleware {
  constructor(
    @inject(TYPES.ConfigService)
    private readonly configService: ConfigService
  ) {}

  execute = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers

    const sendResponse = () => {
      res.status(401).json({ message: 'Unauthorized' })
    }

    if (!authorization) {
      sendResponse()
      return
    }

    const [basic, token] = authorization.split(' ')

    if (basic !== 'Basic') {
      sendResponse()
      return
    }

    const decoded = Buffer.from(token, 'base64').toString()
    const [login, password] = decoded.split(':')

    if (
      login !== this.configService.get('BASIC_LOGIN') ||
      password !== this.configService.get('BASIC_PASSWORD')
    ) {
      sendResponse()
      return
    }

    next()
  }
}

export { AuthMiddlewareGuard }
