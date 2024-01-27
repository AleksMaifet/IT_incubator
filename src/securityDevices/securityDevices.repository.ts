import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TYPES } from '../types'
import { RefreshTokenMetaModel } from './refreshTokenMeta.model'
import { IRefreshTokenMeta } from './interface'

@injectable()
class SecurityDevicesRepository {
  constructor(
    @inject(TYPES.RefreshTokenMetaModel)
    private readonly refreshTokenMetaModel: typeof RefreshTokenMetaModel
  ) {}

  private _mapGenerateDeviceResponse = (dto: IRefreshTokenMeta) => {
    const { clientIp, deviceName, deviceId, issuedAt } = dto

    return {
      ip: clientIp,
      title: deviceName,
      lastActiveDate: issuedAt,
      deviceId,
    }
  }

  public createRefreshTokenMeta = async (dto: IRefreshTokenMeta) => {
    return await this.refreshTokenMetaModel.create(dto)
  }

  public getRefreshTokenMeta = async (
    dto: Pick<IRefreshTokenMeta, 'userId' | 'deviceId'>
  ) => {
    const { userId, deviceId } = dto

    return await this.refreshTokenMetaModel.findOne({ userId, deviceId }).exec()
  }

  public deleteRefreshTokenMeta = async (
    dto: Pick<IRefreshTokenMeta, 'userId' | 'deviceId'>
  ) => {
    const { userId, deviceId } = dto

    return await this.refreshTokenMetaModel
      .deleteOne({ userId, deviceId })
      .exec()
  }

  public deleteExpiredRefreshToken = async () => {
    const currentDate = new Date().toLocaleString('ru-RU')

    return await this.refreshTokenMetaModel
      .deleteMany({
        expirationAt: { $lt: currentDate },
      })
      .exec()
  }

  public getAllDevices = async (userId: string) => {
    const devices = await this.refreshTokenMetaModel.find({ userId }).exec()

    return devices.map(this._mapGenerateDeviceResponse)
  }

  public getDeviceByDeviceId = async (deviceId: string) => {
    console.log(deviceId)
    return await this.refreshTokenMetaModel.findOne({ deviceId }).exec()
  }

  public deleteAllDevices = async (userId: string) => {
    return await this.refreshTokenMetaModel.deleteMany({ userId }).exec()
  }

  public deleteDeviceByDeviceId = async (deviceId: string) => {
    return await this.refreshTokenMetaModel.deleteOne({ deviceId }).exec()
  }
}

export { SecurityDevicesRepository }
