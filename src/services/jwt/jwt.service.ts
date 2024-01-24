import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { sign, verify } from 'jsonwebtoken'
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

    const accessToken = sign({ userId }, secretOrPrivateKey, {
      expiresIn: 30,
    })

    return {
      accessToken,
    }
  }

  public generateRefreshToken = (userId: string) => {
    const secretOrPrivateKey = this.configService.get('JWT_SECRET').toString()

    return sign({ userId }, secretOrPrivateKey, {
      expiresIn: 60,
    })
  }

  public getUserIdByToken = (token: string) => {
    const secretOrPrivateKey = this.configService.get('JWT_SECRET').toString()

    try {
      const { userId }: any = verify(token, secretOrPrivateKey)

      return userId
    } catch (error) {
      this.loggerService.error(`${error} ${token}`)
      return null
    }
  }
}

export { JwtService }
