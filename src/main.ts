import { App } from './app'
import { DB } from './db'
import { ConfigService, LoggerService } from './services'
import { ExceptionFilter } from './errors'
import { TestingController, TestingRepository } from './testing'
import { VideosController, VideosRepository } from './videos'
import { BlogsController, BlogsRepository } from './blogs'
import { PostsController, PostsRepository } from './posts'

const bootstrap = () => {
  const logger = new LoggerService()
  const db = new DB()

  const app = new App(
    logger,
    new ExceptionFilter(logger),
    new ConfigService(logger),
    new TestingController(new TestingRepository(db)),
    new VideosController(new VideosRepository(db)),
    new BlogsController(new BlogsRepository(db)),
    new PostsController(new PostsRepository(db))
  )

  app.init()

  return { app }
}

export const boot = bootstrap()
