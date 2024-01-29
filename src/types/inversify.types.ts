const TYPES = {
  Application: Symbol.for('Application'),
  ILogger: Symbol.for('ILogger'),
  ConfigService: Symbol.for('ConfigService'),
  ExceptionFilter: Symbol.for('ExceptionFilter'),
  MongoService: Symbol.for('MongoService'),
  VideosController: Symbol.for('VideosController'),
  BlogsController: Symbol.for('BlogsController'),
  PostsController: Symbol.for('PostsController'),
  AuthController: Symbol.for('AuthController'),
  UsersController: Symbol.for('UsersController'),
  CommentsController: Symbol.for('CommentsController'),
  SecurityDevicesController: Symbol.for('SecurityDevicesController'),
  VideosService: Symbol.for('VideosService'),
  BlogsService: Symbol.for('BlogsService'),
  PostsService: Symbol.for('PostsService'),
  UsersService: Symbol.for('UsersService'),
  AuthService: Symbol.for('AuthService'),
  JwtService: Symbol.for('JwtService'),
  CommentsService: Symbol.for('CommentsService'),
  SecurityDevicesService: Symbol.for('SecurityDevicesService'),
  VideosRepository: Symbol.for('VideosRepository'),
  BlogsRepository: Symbol.for('BlogsRepository'),
  PostsRepository: Symbol.for('PostsRepository'),
  UsersRepository: Symbol.for('UsersRepository'),
  CommentsRepository: Symbol.for('CommentsRepository'),
  AuthRepository: Symbol.for('AuthRepository'),
  SecurityDevicesRepository: Symbol.for('SecurityDevicesRepository'),
  TestingController: Symbol.for('TestingController'),
  TestingRepository: Symbol.for('TestingRepository'),
  BlogModel: Symbol.for('BlogModel'),
  VideoModel: Symbol.for('VideoModel'),
  PostModel: Symbol.for('PostModel'),
  UserModel: Symbol.for('UserModel'),
  CommentModel: Symbol.for('CommentModel'),
  EmailConfirmationModel: Symbol.for('EmailConfirmationModel'),
  PasswordRecoveryConfirmationModel: Symbol.for(
    'PasswordRecoveryConfirmationModel'
  ),
  RefreshTokenMetaModel: Symbol.for('RefreshTokenMetaModel'),
  AuthBasicMiddlewareGuard: Symbol.for('AuthBasicMiddlewareGuard'),
  AuthBearerMiddlewareGuard: Symbol.for('AuthBearerMiddlewareGuard'),
  AuthCredentialRefreshTokenMiddlewareGuard: Symbol.for(
    'AuthCredentialRefreshTokenMiddlewareGuard'
  ),
  AuthRefreshTokenMiddlewareGuard: Symbol.for(
    'AuthRefreshTokenMiddlewareGuard'
  ),
  AdapterEmail: Symbol.for('AdapterEmail'),
  ManagerEmail: Symbol.for('ManagerEmail'),
}

export { TYPES }
