import express, { Express, json } from 'express'
import { Server } from 'http'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import cookieParser from 'cookie-parser'
import { ConfigService, ILogger } from './services'
import { TestingController } from './testing'
import { AuthController } from './auth'
import { UsersController } from './users'
import { VideosController } from './videos'
import { BlogsController } from './blogs'
import { PostsController } from './posts'
import { MongoService } from './db'
import { TYPES } from './types'
import { CommentsController } from './comments'
import { SecurityDevicesController } from './securityDevices'

@injectable()
class App {
  public readonly app: Express
  private server: Server
  private readonly port: number

  constructor(
    @inject(TYPES.ILogger) private readonly loggerService: ILogger,
    @inject(TYPES.ConfigService)
    private readonly configService: ConfigService,
    @inject(TYPES.MongoService) private readonly mongoService: MongoService,
    @inject(TYPES.TestingController)
    private readonly testingController: TestingController,
    @inject(TYPES.AuthController)
    private readonly authController: AuthController,
    @inject(TYPES.UsersController)
    private readonly usersController: UsersController,
    @inject(TYPES.VideosController)
    private readonly videosController: VideosController,
    @inject(TYPES.BlogsController)
    private readonly blogsController: BlogsController,
    @inject(TYPES.PostsController)
    private readonly postsController: PostsController,
    @inject(TYPES.CommentsController)
    private readonly commentsController: CommentsController,
    @inject(TYPES.SecurityDevicesController)
    private readonly securityDevicesController: SecurityDevicesController
  ) {
    this.app = express()
    this.port = this.normalizePort(this.configService.get('PORT'))
  }

  private normalizePort(val: string | number) {
    if (typeof val === 'string') {
      return parseInt(val, 10)
    }

    return val
  }

  private useMiddleware = () => {
    this.app.set('trust proxy', true)
    this.app.use(json())
    this.app.use(cookieParser())
  }

  private useRoutes = () => {
    /**
     App routes
     */
    const primaryRoutes = [
      { path: '/auth', controller: this.authController.router },
      { path: '/users', controller: this.usersController.router },
      { path: '/videos', controller: this.videosController.router },
      { path: '/blogs', controller: this.blogsController.router },
      { path: '/posts', controller: this.postsController.router },
      { path: '/comments', controller: this.commentsController.router },
      { path: '/security', controller: this.securityDevicesController.router },
    ]

    /**
     Route for test
     */
    this.app.use('/testing', this.testingController.router)

    primaryRoutes.forEach((r) => {
      this.app.use(r.path, r.controller)
      this.loggerService.log(`${r.path} controller connected`)
    })
  }

  public init = async () => {
    this.useMiddleware()
    this.useRoutes()
    await this.mongoService.connect()
    this.server = this.app.listen(this.port)

    this.loggerService.log(`Server started on port: ${this.port}`)
  }

  public close = () => {
    this.server.close()
  }
}

export { App }
