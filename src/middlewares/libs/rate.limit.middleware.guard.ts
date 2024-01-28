import { NextFunction, Request, Response } from 'express'
import { injectable } from 'inversify'
import 'reflect-metadata'
import { RateLimiterMemory } from 'rate-limiter-flexible'
import { IMiddleware } from '../middleware.interface'

@injectable()
class RateLimitMiddlewareGuard implements IMiddleware {
  private _rateLimiter = new RateLimiterMemory({
    keyPrefix: 'middleware',
    points: 5,
    duration: 10,
  })

  // constructor(
  //   private readonly limit: number,
  //   private readonly duration: number
  // ) {
  //   this._rateLimiter =
  // }

  execute = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this._rateLimiter.consume(req.ip!)
      next()
    } catch (e) {
      res.sendStatus(429)
    }
  }
}

export { RateLimitMiddlewareGuard }
