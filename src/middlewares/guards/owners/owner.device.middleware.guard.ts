import { NextFunction, Request, Response } from 'express'
import { BaseDevice, SecurityDevicesService } from '../../../securityDevices'
import { IMiddleware } from '../../middleware.interface'

class OwnerDeviceMiddlewareGuard implements IMiddleware {
  constructor(
    private readonly securityDevicesService: SecurityDevicesService
  ) {}

  async execute(
    { params, context }: Request<BaseDevice>,
    res: Response,
    next: NextFunction
  ) {
    const { id } = params
    const { user } = context

    const device = await this.securityDevicesService.getDeviceByDeviceId(id)

    if (user.id !== device?.userId) {
      res.sendStatus(403)
      return
    }

    next()
  }
}

export { OwnerDeviceMiddlewareGuard }
