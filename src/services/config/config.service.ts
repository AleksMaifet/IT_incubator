import { config, DotenvParseOutput } from 'dotenv'
import { ILogger } from '../logger/logger.interface'
import { IConfigService } from './config.interface'

class ConfigService implements IConfigService {
  private static singleton: ConfigService
  private readonly config: DotenvParseOutput

  constructor(private readonly loggerService: ILogger) {
    if (ConfigService.singleton) {
      return ConfigService.singleton
    }

    ConfigService.singleton = this

    const result = config()

    if (result.error) {
      this.loggerService.error('ConfigService failed')
    } else {
      this.loggerService.log('ConfigService connected')
      this.config = result.parsed as DotenvParseOutput
    }
  }

  get = <T extends number | string>(key: string) => {
    return this.config[key] as T
  }
}

export { ConfigService }
