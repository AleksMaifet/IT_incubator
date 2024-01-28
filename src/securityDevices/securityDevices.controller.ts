import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { BaseController } from '../common'
import { TYPES } from '../types'
import { SecurityDevicesService } from './securityDevices.service'
import {
  AuthRefreshTokenMiddlewareGuard,
  OwnerDeviceMiddlewareGuard,
  ValidateParamsMiddleware,
} from '../middlewares'
import { BaseDevice } from './dto'

@injectable()
class SecurityDevicesController extends BaseController {
  constructor(
    @inject(TYPES.SecurityDevicesService)
    private readonly securityDevicesService: SecurityDevicesService,
    @inject(TYPES.AuthRefreshTokenMiddlewareGuard)
    private readonly authRefreshTokenMiddlewareGuard: AuthRefreshTokenMiddlewareGuard
  ) {
    super()
    this.bindRoutes({
      path: '/devices',
      method: 'get',
      func: this.getAllDevices,
      middlewares: [this.authRefreshTokenMiddlewareGuard],
    })
    this.bindRoutes({
      path: '/devices',
      method: 'delete',
      func: this.deleteAllDevices,
      middlewares: [this.authRefreshTokenMiddlewareGuard],
    })
    this.bindRoutes({
      path: '/devices/:id',
      method: 'delete',
      func: this.deleteDeviceByDeviceId,
      middlewares: [
        new ValidateParamsMiddleware(BaseDevice),
        this.authRefreshTokenMiddlewareGuard,
        new OwnerDeviceMiddlewareGuard(this.securityDevicesService),
      ],
    })
  }

  private getAllDevices = async (req: Request, res: Response) => {
    const {
      context: {
        user: { id },
      },
    } = req

    const result = await this.securityDevicesService.getAllDevices(id)

    res.status(200).json(result)
  }

  private deleteAllDevices = async (req: Request, res: Response) => {
    const {
      context: {
        user: { id },
        token: { deviceId },
      },
    } = req

    await this.securityDevicesService.deleteAllDevices({
      userId: id,
      deviceId,
    })

    res.sendStatus(204)
  }

  private deleteDeviceByDeviceId = async (
    req: Request<BaseDevice>,
    res: Response
  ) => {
    const {
      params: { id },
    } = req

    await this.securityDevicesService.deleteDeviceByDeviceId(id)

    res.sendStatus(204)
  }
}

export { SecurityDevicesController }
