import { App } from './app'
import { MongoService } from './db'
import { ConfigService, LoggerService } from './services'
import { ExceptionFilter } from './errors'
import { TestingController, TestingRepository } from './testing'
import { VideoModel, VideosController, VideosRepository } from './videos'
import { BlogModel, BlogsController, BlogsRepository } from './blogs'
import { PostModel, PostsController, PostsRepository } from './posts'

const bootstrap = () => {
  const logger = new LoggerService()

  const app = new App(
    logger,
    new ExceptionFilter(logger),
    new ConfigService(logger),
    new MongoService(new ConfigService(logger), logger),
    new TestingController(
      new TestingRepository(VideoModel, BlogModel, PostModel)
    ),
    new VideosController(new VideosRepository(VideoModel)),
    new BlogsController(new BlogsRepository(BlogModel)),
    new PostsController(new PostsRepository(BlogModel, PostModel))
  )

  app.init()

  return { app }
}

export const boot = bootstrap()
