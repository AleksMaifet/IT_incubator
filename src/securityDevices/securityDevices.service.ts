import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { SecurityDevicesRepository } from './securityDevices.repository'
import { IRefreshTokenMeta } from './interface'

@injectable()
class SecurityDevicesService {
  constructor(
    @inject(TYPES.SecurityDevicesRepository)
    private readonly securityDevicesRepository: SecurityDevicesRepository
  ) {}

  private _mapTimeStampsToDB = ({
    issuedAt,
    expirationAt,
  }: {
    issuedAt: number
    expirationAt: number
  }) => {
    const generateLocale = (value: number) => {
      return new Date(value * 1000).toLocaleString('ru-RU')
    }

    return {
      iat: generateLocale(issuedAt),
      exp: generateLocale(expirationAt),
    }
  }

  public createRefreshTokenMeta = async (
    dto: Pick<
      IRefreshTokenMeta,
      'userId' | 'deviceId' | 'deviceName' | 'clientIp'
    > & {
      issuedAt: number
      expirationAt: number
    }
  ) => {
    const { userId, deviceId, issuedAt, expirationAt, deviceName, clientIp } =
      dto

    const timeSteps = this._mapTimeStampsToDB({ issuedAt, expirationAt })

    const { iat, exp } = timeSteps

    return await this.securityDevicesRepository.createRefreshTokenMeta({
      userId,
      deviceId,
      issuedAt: iat,
      expirationAt: exp,
      deviceName,
      clientIp,
    })
  }

  public getRefreshTokenMeta = async (
    dto: Pick<IRefreshTokenMeta, 'userId' | 'deviceId'>
  ) => {
    return await this.securityDevicesRepository.getRefreshTokenMeta(dto)
  }

  public deleteRefreshTokenMeta = async (
    dto: Pick<IRefreshTokenMeta, 'userId' | 'deviceId'>
  ) => {
    return await this.securityDevicesRepository.deleteRefreshTokenMeta(dto)
  }

  public deleteExpiredRefreshToken = async () => {
    return await this.securityDevicesRepository.deleteExpiredRefreshToken()
  }

  public getAllDevices = async (id: string) => {
    return await this.securityDevicesRepository.getAllDevices(id)
  }

  public getDeviceByDeviceId = async (id: string) => {
    return await this.securityDevicesRepository.getDeviceByDeviceId(id)
  }

  public deleteAllDevices = async (id: string) => {
    return await this.securityDevicesRepository.deleteAllDevices(id)
  }

  public deleteDeviceByDeviceId = async (id: string) => {
    return await this.securityDevicesRepository.deleteDeviceByDeviceId(id)
  }
}

export { SecurityDevicesService }
