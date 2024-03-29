import { connect, disconnect } from 'mongoose'
import { inject, injectable } from 'inversify'
import { ConfigService } from '../services'
import { TYPES } from '../types'
import { ILogger } from '../services'

@injectable()
class MongoService {
  constructor(
    @inject(TYPES.ILogger) private readonly loggerService: ILogger,
    @inject(TYPES.ConfigService)
    private readonly configService: ConfigService
  ) {}

  private _getNameDB(env: string) {
    switch (true) {
      case env === 'test':
        return this.configService.get('MONGO_DB_NAME_TEST').toString()
      default:
        return this.configService.get('MONGO_DB_NAME').toString()
    }
  }

  public async connect() {
    try {
      const NODE_ENV = this.configService.get('NODE_ENV')?.toString()
      const DB = this._getNameDB(NODE_ENV)

      await connect(this.configService.get('MONGO_DB_URL'), {
        dbName: DB,
        autoIndex: true,
        autoCreate: true,
      })

      this.loggerService.log(`Connected to MongoDB: ${DB}`)
    } catch (err) {
      if (err instanceof Error) {
        this.loggerService.error('Connection to MongoDB failed: ' + err.message)
      }
    }
  }

  public async disconnect() {
    await disconnect()
    this.loggerService.log('Disconnect to MongoDB')
  }
}

export { MongoService }
