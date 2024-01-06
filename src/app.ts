import express, { Express, json } from 'express'
import { Server } from 'http'
import { ExceptionFilter } from './errors'
import { ILogger } from './services/logger/logger.interface'
import { TestingController } from './testing'
import { VideosController } from './videos'
import { BlogsController } from './blogs'
import { ConfigService } from './services'
import { PostsController } from './posts'

class App {
  public readonly app: Express
  private server: Server
  private readonly port: number
  private readonly logger: ILogger
  private readonly _exceptionFilter: ExceptionFilter

  constructor(
    private readonly loggerService: ILogger,
    private readonly exceptionFilter: ExceptionFilter,
    private readonly configService: ConfigService,
    private readonly testingController: TestingController,
    private readonly videoController: VideosController,
    private readonly blogsController: BlogsController,
    private readonly postsController: PostsController
  ) {
    this.app = express()
    this.port = this.normalizePort(
      process.env.PORT || this.configService.get('PORT')
    )
    this.logger = loggerService
    this._exceptionFilter = exceptionFilter
  }

  private normalizePort(val: string | number) {
    if (typeof val === 'string') {
      return parseInt(val, 10)
    }

    return val
  }

  private useMiddleware = () => {
    this.app.use(json())
  }

  private useRoutes = () => {
    /**
     Route for test
     */
    this.app.use('/testing', this.testingController.router)

    /**
     App routes
     */
    this.app.use('/videos', this.videoController.router)
    this.app.use('/blogs', this.blogsController.router)
    this.app.use('/posts', this.postsController.router)
  }

  private useExceptionFilter = () => {
    this.app.use(this._exceptionFilter.catch)
  }

  public init = () => {
    this.useMiddleware()
    this.useRoutes()
    this.useExceptionFilter()
    this.server = this.app.listen(this.port)

    this.logger.log(`Server started on port: ${this.port}`)
  }

  public close = () => {
    this.server.close()
  }
}

export { App }
