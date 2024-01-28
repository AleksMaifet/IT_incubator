import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { sign, verify } from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { TYPES } from '../../types'
import { ConfigService } from '../config'
import { LoggerService } from '../logger'

@injectable()
class JwtService {
  constructor(
    @inject(TYPES.ConfigService) private readonly configService: ConfigService,
    @inject(TYPES.ILogger) private readonly loggerService: LoggerService
  ) {}

  public generateAccessToken = (userId: string) => {
    const secretOrPrivateKey = this.configService.get('JWT_SECRET').toString()

    return sign({ userId }, secretOrPrivateKey, {
      expiresIn: 10,
    })
  }

  public generateRefreshToken = (userId: string) => {
    const secretOrPrivateKey = this.configService.get('JWT_SECRET').toString()

    return sign({ userId, deviceId: uuidv4() }, secretOrPrivateKey, {
      expiresIn: 20,
    })
  }

  public updateRefreshToken = (userId: string, deviceId: string) => {
    const secretOrPrivateKey = this.configService.get('JWT_SECRET').toString()

    return sign({ userId, deviceId }, secretOrPrivateKey, {
      expiresIn: 20,
    })
  }

  public getJwtDataByToken = (token: string): Nullable<any> => {
    const secretOrPrivateKey = this.configService.get('JWT_SECRET').toString()

    try {
      return verify(token, secretOrPrivateKey)
    } catch (error) {
      this.loggerService.error(`${error} ${token}`)
      return null
    }
  }
}

export { JwtService }
