import { Router } from 'express'
import { IControllerRouter } from './route.interface'

export abstract class BaseController {
  private readonly _router: Router

  protected constructor() {
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
