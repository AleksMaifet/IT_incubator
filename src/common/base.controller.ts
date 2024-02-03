import { Router } from 'express'
import { injectable } from 'inversify'
import { IControllerRouter } from './route.interface'

@injectable()
export abstract class BaseController {
  private readonly _router: Router

  constructor() {
    this._router = Router()
  }

  get router() {
    return this._router
  }

  protected bindRoutes(route: IControllerRouter) {
    const { func, method, path } = route

    const middleware = route.middlewares?.map((m) => m.execute.bind(m))
    const bindingFunc = func.bind(this)
    const pipeline = middleware ? [...middleware, bindingFunc] : bindingFunc

    this.router[method](path, pipeline)
  }
}
