import { NextFunction, Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { IMiddleware } from '../../middleware.interface'
import { TYPES } from '../../../types'
import { JwtService } from '../../../services'
import { REFRESH_TOKEN_COOKIE_NAME } from '../../../auth'
import { SecurityDevicesService } from '../../../securityDevices'

@injectable()
class AuthCredentialRefreshTokenMiddlewareGuard implements IMiddleware {
  constructor(
    @inject(TYPES.JwtService) private readonly jwtService: JwtService,
    @inject(TYPES.SecurityDevicesService)
    private readonly securityDevicesService: SecurityDevicesService
  ) {}

  execute = async (req: Request, res: Response, next: NextFunction) => {
    const { cookies } = req

    const refreshToken = cookies[REFRESH_TOKEN_COOKIE_NAME]

    const sendResponse = () => {
      res.sendStatus(401)
    }

    const payload = this.jwtService.getJwtDataByToken(refreshToken)

    const { userId, deviceId } = payload

    const token = await this.securityDevicesService.getRefreshTokenMeta({
      userId,
      deviceId,
    })

    if (!token) {
      sendResponse()
      return
    }

    await this.securityDevicesService.deleteRefreshTokenMeta({
      userId,
      deviceId,
    })

    next()
  }
}

export { AuthCredentialRefreshTokenMiddlewareGuard }
