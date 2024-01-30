import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { sign, verify } from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { TYPES } from '../../types'
import { ConfigService } from '../config'
import { LoggerService } from '../logger'

@injectable()
class JwtService {
  private readonly _secretOrPrivateKey: string

  constructor(
    @inject(TYPES.ConfigService) private readonly configService: ConfigService,
    @inject(TYPES.ILogger) private readonly loggerService: LoggerService
  ) {
    this._secretOrPrivateKey = this.configService.get('JWT_SECRET').toString()
  }

  public generateAccessToken(userId: string) {
    return sign({ userId }, this._secretOrPrivateKey, {
      expiresIn: 10,
    })
  }

  public generateRefreshToken(userId: string) {
    return sign({ userId, deviceId: uuidv4() }, this._secretOrPrivateKey, {
      expiresIn: 20,
    })
  }

  public updateRefreshToken(userId: string, deviceId: string) {
    return sign({ userId, deviceId }, this._secretOrPrivateKey, {
      expiresIn: 20,
    })
  }

  public getJwtDataByToken(token: string): Nullable<any> {
    try {
      return verify(token, this._secretOrPrivateKey)
    } catch (error) {
      this.loggerService.error(`${error} ${token}`)
      return null
    }
  }
}

export { JwtService }
