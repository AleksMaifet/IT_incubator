import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { sign, verify } from 'jsonwebtoken'
import { TYPES } from '@src/types'
import { ConfigService } from '../config'
import { LoggerService } from '../logger'

@injectable()
class JwtService {
  constructor(
    @inject(TYPES.ConfigService) private readonly configService: ConfigService,
    @inject(TYPES.ILogger) private readonly loggerService: LoggerService
  ) {}

  public generate = (userId: string) => {
    const secretOrPrivateKey = this.configService.get('JWT_SECRET').toString()

    try {
      const accessToken = sign({ userId }, secretOrPrivateKey, {
        expiresIn: '1h',
      })

      return {
        accessToken,
      }
    } catch (error) {
      this.loggerService.error(error)
      return {
        accessToken: null,
      }
    }
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
