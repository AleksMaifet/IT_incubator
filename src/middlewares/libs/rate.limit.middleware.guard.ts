import { Request, Response, NextFunction } from 'express'
import { IMiddleware } from '../middleware.interface'
import { clearTimeout } from 'timers'

interface IStorageOptions {
  totalHits: number
  expiresAt: number
}

class RateLimitMiddleware implements IMiddleware {
  private _storage: Record<string, IStorageOptions> = {}
  private timeoutIds: NodeJS.Timeout[] = []
  private _timeoutId: NodeJS.Timeout

  constructor(
    private readonly limit: number,
    private readonly ttl: number
  ) {}

  get storage(): Record<string, IStorageOptions> {
    return this._storage
  }

  private getExpirationTime = (key: string) => {
    return Math.floor((this.storage[key].expiresAt - Date.now()) / 1000)
  }

  private setExpirationTime = (key: string, ttlMilliseconds: number) => {
    const timeoutId = setTimeout(() => {
      this.storage[key].totalHits--

      clearTimeout(timeoutId)

      this.timeoutIds = this.timeoutIds.filter((id) => id != timeoutId)
    }, ttlMilliseconds)

    this.timeoutIds.push(timeoutId)
  }

  increment = async (key: string, ttl: number) => {
    const ttlMilliseconds = ttl

    if (!this.storage[key]) {
      this.storage[key] = {
        totalHits: 0,
        expiresAt: Date.now() + ttlMilliseconds,
      }
    }

    let timeToExpire = this.getExpirationTime(key)

    if (timeToExpire <= 0) {
      this.storage[key].expiresAt = Date.now() + ttlMilliseconds
      timeToExpire = this.getExpirationTime(key)
    }

    this.storage[key].totalHits++
    this.setExpirationTime(key, ttlMilliseconds)

    return {
      totalHits: this.storage[key].totalHits,
      timeToExpire,
    }
  }

  private _onApplicationShutdown = () => {
    this.timeoutIds.forEach(clearTimeout)
    this.timeoutIds = []
  }

  private _cleanupExpiredAttempts = (key: string) => {
    this.storage[key].totalHits = 0
  }

  execute = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip!

    const { totalHits } = await this.increment(ip, this.ttl)

    if (totalHits > this.limit) {
      res.sendStatus(429)
      this._onApplicationShutdown()
      return
    }

    clearTimeout(this._timeoutId)

    this._timeoutId = setTimeout(() => {
      this._cleanupExpiredAttempts(ip)
    }, this.ttl)

    next()
  }
}

export { RateLimitMiddleware }
