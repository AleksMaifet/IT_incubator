import { Validate } from 'class-validator'
import { IsDeviceExist } from '../../../middlewares'

class BaseDevice {
  @Validate(IsDeviceExist, {
    message: 'device is not exists',
  })
  readonly id: string
}

export { BaseDevice }
