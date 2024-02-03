import { config, DotenvParseOutput } from 'dotenv'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../types'
import { ILogger } from '../logger'
import { IConfigService } from './config.interface'

@injectable()
class ConfigService implements IConfigService {
  private readonly config: DotenvParseOutput

  constructor(@inject(TYPES.ILogger) private readonly loggerService: ILogger) {
    const result = config()

    if (result.error) {
      this.loggerService.error('ConfigService failed')
    } else {
      this.loggerService.log('ConfigService connected')
      this.config = result.parsed as DotenvParseOutput
    }
  }

  get<T extends number | string>(key: string) {
    return (process.env[key] || this.config[key]) as T
  }
}

export { ConfigService }
