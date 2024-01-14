import { Container, ContainerModule, interfaces } from 'inversify'
import { useContainer } from 'class-validator'
import { App } from './app'
import { MongoService } from './db'
import { ConfigService, LoggerService } from './services'
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
import { TYPES } from './types'
import { ILogger } from './services/logger/logger.interface'
import { AuthMiddlewareGuard, IMiddleware } from './middlewares'

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<App>(TYPES.Application).to(App)
  bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope()
  bind<ConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope()
  bind<MongoService>(TYPES.MongoService).to(MongoService).inSingletonScope()
  bind<VideosController>(TYPES.VideosController).to(VideosController)
  bind<BlogsController>(TYPES.BlogsController).to(BlogsController)
  bind<PostsController>(TYPES.PostsController).to(PostsController)
  bind<VideosService>(TYPES.VideosService).to(VideosService)
  bind<BlogsService>(TYPES.BlogsService).to(BlogsService)
  bind<PostsService>(TYPES.PostsService).to(PostsService)
  bind<VideosRepository>(TYPES.VideosRepository).to(VideosRepository)
  bind<BlogsRepository>(TYPES.BlogsRepository).to(BlogsRepository)
  bind<PostsRepository>(TYPES.PostsRepository).to(PostsRepository)
  bind<TestingController>(TYPES.TestingController).to(TestingController)
  bind<TestingRepository>(TYPES.TestingRepository).to(TestingRepository)
  bind<typeof BlogModel>(TYPES.BlogModel).toConstantValue(BlogModel)
  bind<typeof PostModel>(TYPES.PostModel).toConstantValue(PostModel)
  bind<typeof VideoModel>(TYPES.VideoModel).toConstantValue(VideoModel)
  bind<IMiddleware>(TYPES.AuthMiddlewareGuard).to(AuthMiddlewareGuard)
})

const bootstrap = () => {
  const appContainer = new Container({ autoBindInjectable: true })
  useContainer(appContainer, { fallbackOnErrors: true })
  appContainer.load(appBindings)

  const app = appContainer.get<App>(TYPES.Application)
  app.init()

  return { app }
}

export const boot = bootstrap()
