import { ContainerModule, interfaces } from 'inversify'
import { App } from '../app'
import { TYPES } from '../types'
import { ConfigService, ILogger, JwtService, LoggerService } from '../services'
import { MongoService } from '../db'
import {
  AuthController,
  AuthRepository,
  AuthService,
  EmailConfirmationModel,
  PasswordRecoveryConfirmationModel,
} from '../auth'
import {
  UserModel,
  UsersController,
  UsersRepository,
  UsersService,
} from '../users'
import {
  VideoModel,
  VideosController,
  VideosRepository,
  VideosService,
} from '../videos'
import {
  BlogModel,
  BlogsController,
  BlogsRepository,
  BlogsService,
} from '../blogs'
import {
  PostModel,
  PostsController,
  PostsRepository,
  PostsService,
} from '../posts'
import {
  CommentModel,
  CommentsController,
  CommentsRepository,
  CommentsService,
} from '../comments'
import { TestingController, TestingRepository } from '../testing'
import {
  AuthBasicMiddlewareGuard,
  AuthBearerMiddlewareGuard,
  AuthCredentialRefreshTokenMiddlewareGuard,
  AuthRefreshTokenMiddlewareGuard,
  IMiddleware,
} from '../middlewares'
import { AdapterEmail } from '../adapters'
import { ManagerEmail } from '../managers'

import {
  RefreshTokenMetaModel,
  SecurityDevicesController,
  SecurityDevicesRepository,
  SecurityDevicesService,
} from '../securityDevices'

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
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
  bind<SecurityDevicesController>(TYPES.SecurityDevicesController).to(
    SecurityDevicesController
  )
  bind<VideosService>(TYPES.VideosService).to(VideosService)
  bind<BlogsService>(TYPES.BlogsService).to(BlogsService)
  bind<PostsService>(TYPES.PostsService).to(PostsService)
  bind<AuthService>(TYPES.AuthService).to(AuthService)
  bind<UsersService>(TYPES.UsersService).to(UsersService)
  bind<CommentsService>(TYPES.CommentsService).to(CommentsService)
  bind<SecurityDevicesService>(TYPES.SecurityDevicesService).to(
    SecurityDevicesService
  )
  bind<VideosRepository>(TYPES.VideosRepository).to(VideosRepository)
  bind<BlogsRepository>(TYPES.BlogsRepository).to(BlogsRepository)
  bind<PostsRepository>(TYPES.PostsRepository).to(PostsRepository)
  bind<UsersRepository>(TYPES.UsersRepository).to(UsersRepository)
  bind<AuthRepository>(TYPES.AuthRepository).to(AuthRepository)
  bind<CommentsRepository>(TYPES.CommentsRepository).to(CommentsRepository)
  bind<SecurityDevicesRepository>(TYPES.SecurityDevicesRepository).to(
    SecurityDevicesRepository
  )
  bind<TestingController>(TYPES.TestingController).to(TestingController)
  bind<TestingRepository>(TYPES.TestingRepository).to(TestingRepository)
  bind<typeof BlogModel>(TYPES.BlogModel).toConstantValue(BlogModel)
  bind<typeof PostModel>(TYPES.PostModel).toConstantValue(PostModel)
  bind<typeof VideoModel>(TYPES.VideoModel).toConstantValue(VideoModel)
  bind<typeof UserModel>(TYPES.UserModel).toConstantValue(UserModel)
  bind<typeof CommentModel>(TYPES.CommentModel).toConstantValue(CommentModel)
  bind<typeof EmailConfirmationModel>(
    TYPES.EmailConfirmationModel
  ).toConstantValue(EmailConfirmationModel)
  bind<typeof PasswordRecoveryConfirmationModel>(
    TYPES.PasswordRecoveryConfirmationModel
  ).toConstantValue(PasswordRecoveryConfirmationModel)
  bind<typeof RefreshTokenMetaModel>(
    TYPES.RefreshTokenMetaModel
  ).toConstantValue(RefreshTokenMetaModel)
  bind<IMiddleware>(TYPES.AuthBasicMiddlewareGuard).to(AuthBasicMiddlewareGuard)
  bind<IMiddleware>(TYPES.AuthBearerMiddlewareGuard).to(
    AuthBearerMiddlewareGuard
  )
  bind<IMiddleware>(TYPES.AuthCredentialRefreshTokenMiddlewareGuard).to(
    AuthCredentialRefreshTokenMiddlewareGuard
  )
  bind<IMiddleware>(TYPES.AuthRefreshTokenMiddlewareGuard).to(
    AuthRefreshTokenMiddlewareGuard
  )
  bind<AdapterEmail>(TYPES.AdapterEmail).to(AdapterEmail).inSingletonScope()
  bind<ManagerEmail>(TYPES.ManagerEmail).to(ManagerEmail)
})
