import { App } from './app'
import { MongoService } from './db'
import { ConfigService, LoggerService } from './services'
import { ExceptionFilter } from './errors'
import { TestingController, TestingRepository } from './testing'
import {
  VideoModel,
  VideosController,
  VideosRepository,
  VideosService,
} from './videos'
import {
  BlogModel,
  BlogsController,
  BlogsRepository,
  BlogsService,
} from './blogs'
import {
  PostModel,
  PostsController,
  PostsRepository,
  PostsService,
} from './posts'

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
    new VideosController(new VideosService(new VideosRepository(VideoModel))),
    new BlogsController(new BlogsService(new BlogsRepository(BlogModel))),
    new PostsController(
      new PostsService(
        new BlogsRepository(BlogModel),
        new PostsRepository(PostModel)
      )
    )
  )

  app.init()

  return { app }
}

export const boot = bootstrap()
