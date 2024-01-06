import { createLogger, format, Logger, transports } from 'winston'
import { ILogger } from './logger.interface'

class LoggerService implements ILogger {
  private static singleton: LoggerService
  public logger: Logger

  constructor() {
    if (LoggerService.singleton) {
      return LoggerService.singleton
    }

    LoggerService.singleton = this

    const { combine, timestamp, colorize, printf } = format

    this.logger = createLogger({
      format: combine(
        colorize({
          level: true,
          message: false,
          colors: { info: 'blue', error: 'red', warn: 'yellow' },
        }),
        timestamp({
          format: 'DD/MM - HH:mm:ss',
        }),
        printf(({ level, message, timestamp }) => {
          return `${timestamp} ${level}: ${message}`
        })
      ),
      transports: [new transports.Console()],
    })
  }

  log = (...args: unknown[]) => {
    this.logger.info(args)
  }

  error = (...args: unknown[]) => {
    this.logger.error(args)
  }

  warn = (...args: unknown[]) => {
    this.logger.warn(args)
  }
}

export { LoggerService }
