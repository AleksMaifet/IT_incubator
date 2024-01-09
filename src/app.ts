import express, { Express, json } from 'express'
import { Server } from 'http'
import { ExceptionFilter } from './errors'
import { ILogger } from './services/logger/logger.interface'
import { TestingController } from './testing'
import { VideosController } from './videos'
import { BlogsController } from './blogs'
import { ConfigService } from './services'
import { PostsController } from './posts'
import { MongoService } from './db'

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
    private readonly mongoService: MongoService,
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
     App routes
     */

    const primaryRoutes = [
      { path: '/videos', controller: this.videoController.router },
      { path: '/blogs', controller: this.blogsController.router },
      { path: '/posts', controller: this.postsController.router },
    ]

    /**
     Route for test
     */

    this.app.use('/testing', this.testingController.router)

    primaryRoutes.forEach((r) => {
      this.app.use(r.path, r.controller)
      this.logger.log(`${r.path} controller connected`)
    })
  }

  private useExceptionFilter = () => {
    this.app.use(this._exceptionFilter.catch)
  }

  public init = async () => {
    this.useMiddleware()
    this.useRoutes()
    this.useExceptionFilter()
    await this.mongoService.connect()
    this.server = this.app.listen(this.port)

    this.logger.log(`Server started on port: ${this.port}`)
  }

  public close = () => {
    this.server.close()
  }
}

export { App }
