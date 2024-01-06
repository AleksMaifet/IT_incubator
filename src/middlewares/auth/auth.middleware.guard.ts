import { NextFunction, Request, Response } from 'express'
import { IMiddleware } from '../middleware.interface'
import { ConfigService } from '../../services'

class AuthMiddlewareGuard implements IMiddleware {
  constructor(private readonly configService: ConfigService) {}

  execute = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers

    const sendResponse = () => {
      res.status(401).json({ message: 'Unauthorized' })
    }

    if (!authorization) {
      sendResponse()
      return
    }

    const verify = authorization.split(' ')[1]
    const decoded = Buffer.from(verify, 'base64').toString()
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
