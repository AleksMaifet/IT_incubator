import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { BaseController } from '../common'
import {
  AuthBearerMiddlewareGuard,
  ValidateBodyMiddleware,
} from '../middlewares'
import { TYPES } from '../types'
import { BaseUserDto, CreateUserDto } from '../users'
import { JwtService } from '../services'
import { BaseAuthDto, RegConfirmAuthDto } from './dto'
import { AuthService } from './auth.service'

@injectable()
class AuthController extends BaseController {
  constructor(
    @inject(TYPES.AuthService)
    private readonly authService: AuthService,
    @inject(TYPES.JwtService)
    private readonly jwtService: JwtService,
    @inject(TYPES.AuthBearerMiddlewareGuard)
    private readonly authBearerMiddlewareGuard: AuthBearerMiddlewareGuard
  ) {
    super()
    this.bindRoutes({
      path: '/login',
      method: 'post',
      func: this.login,
      middlewares: [new ValidateBodyMiddleware(BaseAuthDto)],
    })
    this.bindRoutes({
      path: '/me',
      method: 'get',
      func: this.getMe,
      middlewares: [this.authBearerMiddlewareGuard],
    })
    this.bindRoutes({
      path: '/registration',
      method: 'post',
      func: this.registration,
      middlewares: [new ValidateBodyMiddleware(CreateUserDto)],
    })
    this.bindRoutes({
      path: '/registration-confirmation',
      method: 'post',
      func: this.registrationConfirmation,
      middlewares: [new ValidateBodyMiddleware(RegConfirmAuthDto)],
    })
    this.bindRoutes({
      path: '/registration-email-resending',
      method: 'post',
      func: this.registrationEmailResending,
      middlewares: [new ValidateBodyMiddleware(BaseUserDto)],
    })
  }

  private login = async (req: Request<{}, {}, BaseAuthDto>, res: Response) => {
    const { body } = req

    const userId = await this.authService.login(body)

    if (!userId) {
      res.sendStatus(401)
      return
    }

    const jwtDate = this.jwtService.generate(userId)

    res.status(200).json(jwtDate)
  }

  private getMe = async (req: Request, res: Response) => {
    const {
      context: {
        user: { email, id, login },
      },
    } = req

    res.status(200).json({
      email,
      login,
      userId: id,
    })
  }

  private registration = async (
    req: Request<{}, {}, CreateUserDto>,
    res: Response
  ) => {
    const { body } = req

    const result = await this.authService.registration(body)

    if (!result) {
      res.sendStatus(400)
      return
    }

    res.sendStatus(204)
  }

  private registrationConfirmation = async (
    req: Request<{}, {}, RegConfirmAuthDto>,
    res: Response
  ) => {
    const {
      body: { code },
    } = req

    const result = await this.authService.confirmEmail(code)

    if (!result) {
      res.sendStatus(400)
      return
    }

    res.sendStatus(204)
  }

  private registrationEmailResending = async (
    req: Request<{}, {}, BaseUserDto>,
    res: Response
  ) => {
    const {
      body: { email },
    } = req

    const result = await this.authService.registrationEmailResending(email)

    if (!result) {
      res.sendStatus(400)
      return
    }

    res.sendStatus(204)
  }
}

export { AuthController }
