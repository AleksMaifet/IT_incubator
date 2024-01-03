import { NextFunction, Request, Response } from 'express'
import { HttpError } from './httpError.class'

interface IExceptionFilterInterface {
  catch: (
    err: Error | HttpError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => void
}

interface ErrorMessage {
  message: string
  field: string
}

interface ErrorResponse {
  errorsMessages: ErrorMessage[]
}

export { IExceptionFilterInterface, ErrorResponse }
