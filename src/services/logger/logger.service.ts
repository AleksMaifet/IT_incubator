import { createLogger, format, Logger, transports } from 'winston'
import { ILogger } from './interface'

class LoggerService implements ILogger {
  public logger: Logger

  constructor() {
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
