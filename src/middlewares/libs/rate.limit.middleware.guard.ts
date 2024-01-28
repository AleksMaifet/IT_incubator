import { NextFunction, Request, Response } from 'express'
import { RateLimiterAbstract, RateLimiterMemory } from 'rate-limiter-flexible'
import { IMiddleware } from '../middleware.interface'

class RateLimitMiddlewareGuard implements IMiddleware {
  private _rateLimiter: RateLimiterAbstract

  constructor(
    private readonly limit: number,
    private readonly duration: number
  ) {
    this._rateLimiter = new RateLimiterMemory({
      keyPrefix: 'middleware',
      points: this.limit,
      duration: this.duration,
    })
  }

  execute = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.ip, '@')

    try {
      await this._rateLimiter.consume(req.ip!)
      const result = await this._rateLimiter.get(req.ip!)

      console.log(result?.remainingPoints)

      next()
    } catch (e) {
      res.sendStatus(429)
    }
  }
}

export { RateLimitMiddlewareGuard }
