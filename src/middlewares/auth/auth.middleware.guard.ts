import { NextFunction, Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { IMiddleware } from '@src/middlewares'
import { ConfigService } from '@src/services'
import { TYPES } from '@src/types'

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
      login !==
        (this.configService.get('BASIC_LOGIN') || process.env.BASIC_LOGIN) ||
      password !==
        (this.configService.get('BASIC_PASSWORD') || process.env.BASIC_PASSWORD)
    ) {
      sendResponse()
      return
    }

    next()
  }
}

export { AuthMiddlewareGuard }
