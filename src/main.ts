import { App } from './app'
import { VideoController, VideoRepository } from './video'
import { LoggerService } from './services'
import { ExceptionFilter } from './errors'
import { TestingController } from './testing'
import { DB } from './db'

const bootstrap = () => {
  const logger = new LoggerService()
  const videoRepository = new VideoRepository(new DB())

  const app = new App(
    logger,
    new ExceptionFilter(logger),
    new VideoController(videoRepository),
    new TestingController(videoRepository)
  )

  app.init()

  return { app }
}

export const boot = bootstrap()
