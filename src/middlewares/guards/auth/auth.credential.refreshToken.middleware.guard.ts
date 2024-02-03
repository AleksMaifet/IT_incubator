import { NextFunction, Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { IMiddleware } from '../../middleware.interface'
import { TYPES } from '../../../types'
import { SecurityDevicesService } from '../../../securityDevices'

@injectable()
class AuthCredentialRefreshTokenMiddlewareGuard implements IMiddleware {
  constructor(
    @inject(TYPES.SecurityDevicesService)
    private readonly securityDevicesService: SecurityDevicesService
  ) {}

  async execute(req: Request, res: Response, next: NextFunction) {
    const {
      context: {
        user: { id },
        token: { deviceId, iat, exp },
      },
    } = req

    const token = await this.securityDevicesService.getRefreshTokenMeta({
      userId: id,
      deviceId,
      issuedAt: iat,
      expirationAt: exp,
    })

    if (!token) {
      res.sendStatus(401)
      return
    }

    next()
  }
}

export { AuthCredentialRefreshTokenMiddlewareGuard }
