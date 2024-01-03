import { Express, json } from 'express'
import { app } from './settings'
import { VideoController } from './video'
import { ExceptionFilter } from './errors'
import { ILogger } from './services/logger/interface'
import { TestingController } from './testing'

class App {
  private readonly app: Express
  private readonly port: number
  private readonly logger: ILogger
  private readonly _exceptionFilter: ExceptionFilter

  constructor(
    private readonly loggerService: ILogger,
    private readonly exceptionFilter: ExceptionFilter,
    private readonly videoController: VideoController,
    private readonly testingController: TestingController
  ) {
    this.app = app
    this.port = this.normalizePort(process.env.PORT || 9090)
    this.logger = loggerService
    this._exceptionFilter = exceptionFilter
  }

  private normalizePort(val: string | number) {
    const port = parseInt(val as string, 10)

    if (isNaN(port) || port < 0) {
      this.loggerService.error(`Invalid port: ${val}`)
    }

    return port
  }

  private useMiddleware = () => {
    this.app.use(json())
  }

  private useRoutes = () => {
    /**
     Route for test
     */
    this.app.use('/testing', this.testingController.router)

    this.app.use('/videos', this.videoController.router)
  }

  private useExceptionFilter = () => {
    this.app.use(this._exceptionFilter.catch)
  }

  public init = () => {
    this.useMiddleware()
    this.useRoutes()
    this.useExceptionFilter()
    this.app.listen(this.port)

    this.logger.log(`Server started on port: ${this.port}`)
  }
}

export { App }
