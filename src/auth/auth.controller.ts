import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { BaseController } from '../common/base.controller'
import { ValidateBodyMiddleware } from '../middlewares'
import { TYPES } from '../types'
import { BaseLoginDto } from './dto'
import { AuthService } from './auth.service'

@injectable()
class AuthController extends BaseController {
  constructor(
    @inject(TYPES.AuthService)
    private readonly authService: AuthService
  ) {
    super()
    this.bindRoutes({
      path: '/login',
      method: 'post',
      func: this.login,
      middlewares: [new ValidateBodyMiddleware(BaseLoginDto)],
    })
  }

  public login = async (req: Request<{}, {}, BaseLoginDto>, res: Response) => {
    const { body } = req

    const result = await this.authService.login(body)

    if (!result) {
      res.sendStatus(401)
      return
    }

    res.sendStatus(204)
  }
}

export { AuthController }
