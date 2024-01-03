import { App } from './app'
import { VideoController, VideoRepository } from './video'
import { LoggerService } from './services'
import { ExceptionFilter } from './errors'
import { TestingController } from './testing'

const bootstrap = () => {
  const logger = new LoggerService()
  const videoRepository = new VideoRepository()

  const app = new App(
    logger,
    new ExceptionFilter(logger),
    new VideoController(videoRepository),
    new TestingController(videoRepository)
  )

  app.init()
}

bootstrap()
