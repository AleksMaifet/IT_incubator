import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { BaseController } from '../common'
import {
  AuthBearerMiddlewareGuard,
  AuthCredentialTokenMiddlewareGuard,
  ValidateBodyMiddleware,
} from '../middlewares'
import { TYPES } from '../types'
import { BaseUserDto, CreateUserDto } from '../users'
import { JwtService } from '../services'
import { BlackListRefreshTokenRepository } from '../repositories'
import { BaseAuthDto, RegConfirmAuthDto, RegEmailResendingAuthDto } from './dto'
import { AuthService } from './auth.service'
import { REFRESH_TOKEN_COOKIE_NAME } from './constants'

@injectable()
class AuthController extends BaseController {
  constructor(
    @inject(TYPES.AuthService)
    private readonly authService: AuthService,
    @inject(TYPES.JwtService)
    private readonly jwtService: JwtService,
    @inject(TYPES.AuthBearerMiddlewareGuard)
    private readonly authBearerMiddlewareGuard: AuthBearerMiddlewareGuard,
    @inject(TYPES.AuthCredentialTokenMiddlewareGuard)
    private readonly authCredentialTokenMiddlewareGuard: AuthCredentialTokenMiddlewareGuard,
    @inject(TYPES.BlackListRefreshTokenRepository)
    private readonly blackListRefreshTokenRepository: BlackListRefreshTokenRepository
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
      path: '/refresh-token',
      method: 'post',
      func: this.getNewPairAuthTokens,
      middlewares: [this.authCredentialTokenMiddlewareGuard],
    })
    this.bindRoutes({
      path: '/logout',
      method: 'post',
      func: this.logout,
      middlewares: [this.authCredentialTokenMiddlewareGuard],
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
      middlewares: [new ValidateBodyMiddleware(RegEmailResendingAuthDto)],
    })
  }

  private _generatePairAuthTokens = (id: string) => {
    const accessJwtData = this.jwtService.generateAccessToken(id)
    const refreshJwtData = this.jwtService.generateRefreshToken(id)

    return {
      accessJwtData,
      refreshJwtData,
    }
  }

  private login = async (req: Request<{}, {}, BaseAuthDto>, res: Response) => {
    const { body } = req

    const userId = await this.authService.login(body)

    if (!userId) {
      res.sendStatus(401)
      return
    }

    const { accessJwtData, refreshJwtData } =
      this._generatePairAuthTokens(userId)

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshJwtData, {
      httpOnly: true,
      secure: true,
    })
    res.status(200).json(accessJwtData)
  }

  private getNewPairAuthTokens = async (req: Request, res: Response) => {
    const {
      context: {
        user: { id },
      },
    } = req

    const { accessJwtData, refreshJwtData } = this._generatePairAuthTokens(id)

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshJwtData, {
      httpOnly: true,
      secure: true,
    })
    res.status(200).json(accessJwtData)
  }

  private logout = async (req: Request, res: Response) => {
    const { cookies } = req

    const refreshToken = cookies[REFRESH_TOKEN_COOKIE_NAME]

    await this.blackListRefreshTokenRepository.createExpiredRefreshToken(
      refreshToken
    )

    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME)
    res.sendStatus(204)
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

    await this.authService.confirmEmail(code)

    res.sendStatus(204)
  }

  private registrationEmailResending = async (
    req: Request<{}, {}, BaseUserDto>,
    res: Response
  ) => {
    const {
      body: { email },
    } = req

    await this.authService.registrationEmailResending(email)

    res.sendStatus(204)
  }
}

export { AuthController }
