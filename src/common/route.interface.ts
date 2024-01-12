import { Request, Response, NextFunction, Router } from 'express'
import { IMiddleware } from '../middlewares'

export interface IControllerRouter {
  path: string
  func: (
    req: Request<any, any, any, any>,
    res: Response,
    next: NextFunction
  ) => void
  method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>
  middlewares?: IMiddleware[]
}
