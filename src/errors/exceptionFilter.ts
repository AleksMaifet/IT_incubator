import { NextFunction, Request, Response } from 'express'
import { ILogger } from '../services/logger/interface'
import { IExceptionFilterInterface } from './interface'
import { HttpError } from './httpError.class'

class ExceptionFilter implements IExceptionFilterInterface {
  private logger: ILogger

  constructor(private readonly loggerService: ILogger) {
    this.logger = loggerService
  }

  catch = (
    err: Error | HttpError,
    _: Request,
    res: Response,
    __: NextFunction
  ) => {
    if (err instanceof HttpError) {
      const { statusCode, message, context } = err

      this.logger.error(`${context} Error ${statusCode} : ${message}`)

      res.status(statusCode).send(err)
    } else {
      this.logger.error(err)

      res.status(500).send(err)
    }
  }
}

export { ExceptionFilter }
