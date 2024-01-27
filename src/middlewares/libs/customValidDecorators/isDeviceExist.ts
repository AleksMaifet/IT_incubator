import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../../types'
import { SecurityDevicesService } from '../../../securityDevices'

@ValidatorConstraint({ async: true })
@injectable()
class IsDeviceExist implements ValidatorConstraintInterface {
  constructor(
    @inject(TYPES.SecurityDevicesService)
    private readonly securityDevicesService: SecurityDevicesService
  ) {}

  async validate(id: string) {
    const device = await this.securityDevicesService.getDeviceByDeviceId(id)

    return !!device
  }
}

export { IsDeviceExist }
