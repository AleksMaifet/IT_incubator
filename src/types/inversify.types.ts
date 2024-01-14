const TYPES = {
  Application: Symbol.for('Application'),
  ILogger: Symbol.for('ILogger'),
  ConfigService: Symbol.for('ConfigService'),
  ExceptionFilter: Symbol.for('ExceptionFilter'),
  MongoService: Symbol.for('MongoService'),
  VideosController: Symbol.for('VideosController'),
  BlogsController: Symbol.for('BlogsController'),
  PostsController: Symbol.for('PostsController'),
  VideosService: Symbol.for('VideosService'),
  BlogsService: Symbol.for('BlogsService'),
  PostsService: Symbol.for('PostsService'),
  VideosRepository: Symbol.for('VideosRepository'),
  BlogsRepository: Symbol.for('BlogsRepository'),
  PostsRepository: Symbol.for('PostsRepository'),
  TestingController: Symbol.for('TestingController'),
  TestingRepository: Symbol.for('TestingRepository'),
  BlogModel: Symbol.for('BlogModel'),
  VideoModel: Symbol.for('VideoModel'),
  PostModel: Symbol.for('PostModel'),
  AuthMiddlewareGuard: Symbol.for('AuthMiddlewareGuard'),
}

export { TYPES }
