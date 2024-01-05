import { HttpError } from './httpError.class'
import { NextFunction, Request, Response } from 'express'

export interface IExceptionFilterInterface {
  catch: (
    err: Error | HttpError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => void
}
