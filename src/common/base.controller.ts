import { Router } from 'express'
import { injectable } from 'inversify'
import 'reflect-metadata'
import { IControllerRouter } from './route.interface'

@injectable()
export abstract class BaseController {
  private readonly _router: Router

  public constructor() {
    this._router = Router()
  }

  get router() {
    return this._router
  }

  protected bindRoutes = (route: IControllerRouter) => {
    const { func, method, path } = route

    const middleware = route.middlewares?.map((m) => m.execute)
    const pipeline = middleware ? [...middleware, func] : func

    this.router[method](path, pipeline)
  }
}
