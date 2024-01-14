import { connect, disconnect } from 'mongoose'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { ConfigService } from '../services'
import { TYPES } from '../types'
import { ILogger } from '../services/logger/logger.interface'

@injectable()
class MongoService {
  constructor(
    @inject(TYPES.ILogger) private readonly loggerService: ILogger,
    @inject(TYPES.ConfigService)
    private readonly configService: ConfigService
  ) {}

  connect = async () => {
    try {
      await connect(this.configService.get('MONGO_DB_URL'), {
        dbName: this.configService.get('MONGO_DB_NAME').toString(),
        autoIndex: true,
        autoCreate: true,
      })

      this.loggerService.log('Connected to MongoDB')
    } catch (err) {
      if (err instanceof Error) {
        this.loggerService.error('Connection to MongoDB failed: ' + err.message)
      }
    }
  }

  disconnect = async () => {
    await disconnect()
    this.loggerService.log('Disconnect to MongoDB')
  }
}

export { MongoService }
