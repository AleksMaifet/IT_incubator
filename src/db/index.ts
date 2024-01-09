import { connect, disconnect } from 'mongoose'
import { ConfigService, LoggerService } from '../services'

class MongoService {
  private static singleton: MongoService

  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService
  ) {
    if (MongoService.singleton) {
      return MongoService.singleton
    }

    MongoService.singleton = this
  }

  connect = async () => {
    try {
      await connect(
        process.env.MONGO_DB_URL || this.configService.get('MONGO_DB_URL'),
        {
          dbName:
            process.env.MONGO_DB_NAME ||
            this.configService.get('MONGO_DB_NAME').toString(),
          autoIndex: true,
          autoCreate: true,
        }
      )

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
