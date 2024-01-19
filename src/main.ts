import { Container, ContainerModule, interfaces } from 'inversify'
import { useContainer } from 'class-validator'
import { App } from './app'
import { MongoService } from './db'
import { ConfigService, JwtService, LoggerService } from './services'
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
import {
  UserModel,
  UsersController,
  UsersRepository,
  UsersService,
} from './users'
import {
  CommentModel,
  CommentsController,
  CommentsRepository,
  CommentsService,
} from './comments'
import { AuthController, AuthRepository, AuthService } from './auth'
import { TYPES } from './types'
import { ILogger } from './services'
import {
  AuthBasicMiddlewareGuard,
  AuthBearerMiddlewareGuard,
  IMiddleware,
} from './middlewares'

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<App>(TYPES.Application).to(App)
  bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope()
  bind<ConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope()
  bind<MongoService>(TYPES.MongoService).to(MongoService).inSingletonScope()
  bind<JwtService>(TYPES.JwtService).to(JwtService)
  bind<AuthController>(TYPES.AuthController).to(AuthController)
  bind<UsersController>(TYPES.UsersController).to(UsersController)
  bind<VideosController>(TYPES.VideosController).to(VideosController)
  bind<BlogsController>(TYPES.BlogsController).to(BlogsController)
  bind<PostsController>(TYPES.PostsController).to(PostsController)
  bind<CommentsController>(TYPES.CommentsController).to(CommentsController)
  bind<VideosService>(TYPES.VideosService).to(VideosService)
  bind<BlogsService>(TYPES.BlogsService).to(BlogsService)
  bind<PostsService>(TYPES.PostsService).to(PostsService)
  bind<AuthService>(TYPES.AuthService).to(AuthService)
  bind<UsersService>(TYPES.UsersService).to(UsersService)
  bind<CommentsService>(TYPES.CommentsService).to(CommentsService)
  bind<VideosRepository>(TYPES.VideosRepository).to(VideosRepository)
  bind<BlogsRepository>(TYPES.BlogsRepository).to(BlogsRepository)
  bind<PostsRepository>(TYPES.PostsRepository).to(PostsRepository)
  bind<UsersRepository>(TYPES.UsersRepository).to(UsersRepository)
  bind<AuthRepository>(TYPES.AuthRepository).to(AuthRepository)
  bind<CommentsRepository>(TYPES.CommentsRepository).to(CommentsRepository)
  bind<TestingController>(TYPES.TestingController).to(TestingController)
  bind<TestingRepository>(TYPES.TestingRepository).to(TestingRepository)
  bind<typeof BlogModel>(TYPES.BlogModel).toConstantValue(BlogModel)
  bind<typeof PostModel>(TYPES.PostModel).toConstantValue(PostModel)
  bind<typeof VideoModel>(TYPES.VideoModel).toConstantValue(VideoModel)
  bind<typeof UserModel>(TYPES.UserModel).toConstantValue(UserModel)
  bind<typeof CommentModel>(TYPES.CommentModel).toConstantValue(CommentModel)
  bind<IMiddleware>(TYPES.AuthBasicMiddlewareGuard).to(AuthBasicMiddlewareGuard)
  bind<IMiddleware>(TYPES.AuthBearerMiddlewareGuard).to(
    AuthBearerMiddlewareGuard
  )
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
