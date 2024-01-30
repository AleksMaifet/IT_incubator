import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { parse } from 'useragent'
import { BaseController } from '../common'
import {
  AuthBearerMiddlewareGuard,
  AuthCredentialRefreshTokenMiddlewareGuard,
  AuthRefreshTokenMiddlewareGuard,
  RateLimitMiddlewareGuard,
  ValidateBodyMiddleware,
} from '../middlewares'
import { TYPES } from '../types'
import { BaseUserDto, CreateUserDto } from '../users'
import { JwtService } from '../services'
import { SecurityDevicesService } from '../securityDevices'
import {
  BaseAuthDto,
  PassRecoveryDto,
  RegConfirmAuthDto,
  RegEmailResendingAuthDto,
  UpdatePassDto,
} from './dto'
import { AuthService } from './auth.service'
import { REFRESH_TOKEN_COOKIE_NAME } from './constants'

@injectable()
class AuthController extends BaseController {
  constructor(
    @inject(TYPES.AuthService)
    private readonly authService: AuthService,
    @inject(TYPES.JwtService)
    private readonly jwtService: JwtService,
    @inject(TYPES.SecurityDevicesService)
    private readonly securityDevicesService: SecurityDevicesService,
    @inject(TYPES.AuthBearerMiddlewareGuard)
    private readonly authBearerMiddlewareGuard: AuthBearerMiddlewareGuard,
    @inject(TYPES.AuthRefreshTokenMiddlewareGuard)
    private readonly authRefreshTokenMiddlewareGuard: AuthRefreshTokenMiddlewareGuard,
    @inject(TYPES.AuthCredentialRefreshTokenMiddlewareGuard)
    private readonly authCredentialRefreshTokenMiddlewareGuard: AuthCredentialRefreshTokenMiddlewareGuard
  ) {
    super()
    this.bindRoutes({
      path: '/login',
      method: 'post',
      func: this.login,
      middlewares: [
        new RateLimitMiddlewareGuard(5, 10),
        new ValidateBodyMiddleware(BaseAuthDto),
      ],
    })
    this.bindRoutes({
      path: '/password-recovery',
      method: 'post',
      func: this.passwordRecovery,
      middlewares: [
        new RateLimitMiddlewareGuard(5, 10),
        new ValidateBodyMiddleware(PassRecoveryDto),
      ],
    })
    this.bindRoutes({
      path: '/new-password',
      method: 'post',
      func: this.updatePassword,
      middlewares: [
        new RateLimitMiddlewareGuard(5, 10),
        new ValidateBodyMiddleware(UpdatePassDto),
      ],
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
      middlewares: [
        this.authRefreshTokenMiddlewareGuard,
        this.authCredentialRefreshTokenMiddlewareGuard,
      ],
    })
    this.bindRoutes({
      path: '/logout',
      method: 'post',
      func: this.logout,
      middlewares: [
        this.authRefreshTokenMiddlewareGuard,
        this.authCredentialRefreshTokenMiddlewareGuard,
      ],
    })
    this.bindRoutes({
      path: '/registration',
      method: 'post',
      func: this.registration,
      middlewares: [
        new RateLimitMiddlewareGuard(5, 14),
        new ValidateBodyMiddleware(CreateUserDto),
      ],
    })
    this.bindRoutes({
      path: '/registration-confirmation',
      method: 'post',
      func: this.registrationConfirmation,
      middlewares: [
        new RateLimitMiddlewareGuard(5, 10),
        new ValidateBodyMiddleware(RegConfirmAuthDto),
      ],
    })
    this.bindRoutes({
      path: '/registration-email-resending',
      method: 'post',
      func: this.registrationEmailResending,
      middlewares: [
        new RateLimitMiddlewareGuard(5, 13),
        new ValidateBodyMiddleware(RegEmailResendingAuthDto),
      ],
    })
  }

  private async login(req: Request<{}, {}, BaseAuthDto>, res: Response) {
    const { body, headers, ip } = req

    const userId = await this.authService.login(body)

    if (!userId) {
      res.sendStatus(401)
      return
    }

    const accessJwtToken = this.jwtService.generateAccessToken(userId)
    const refreshJwtToken = this.jwtService.generateRefreshToken(userId)
    const payload = this.jwtService.getJwtDataByToken(refreshJwtToken)

    const { deviceId, iat, exp } = payload

    await this.securityDevicesService.createRefreshTokenMeta({
      userId,
      deviceId,
      issuedAt: iat,
      expirationAt: exp,
      deviceName: parse(headers['user-agent']!).family,
      clientIp: ip!,
    })

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshJwtToken, {
      httpOnly: true,
      secure: true,
    })
    res.status(200).json({
      accessToken: accessJwtToken,
    })
  }

  private async passwordRecovery(
    req: Request<{}, {}, PassRecoveryDto>,
    res: Response
  ) {
    const {
      body: { email },
    } = req

    await this.authService.passwordRecovery(email)

    res.sendStatus(204)
  }

  private async updatePassword(
    req: Request<{}, {}, UpdatePassDto>,
    res: Response
  ) {
    const { body } = req

    await this.authService.updateUserPassword(body)

    res.sendStatus(204)
  }

  private async getNewPairAuthTokens(req: Request, res: Response) {
    const {
      context: {
        user: { id },
        token: { deviceId },
      },
    } = req

    const accessJwtToken = this.jwtService.generateAccessToken(id)
    const refreshJwtToken = this.jwtService.updateRefreshToken(id, deviceId)
    const payload = this.jwtService.getJwtDataByToken(refreshJwtToken)

    const { userId, iat, exp } = payload

    await this.securityDevicesService.updateRefreshTokenMeta({
      userId,
      deviceId,
      issuedAt: iat,
      expirationAt: exp,
    })

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshJwtToken, {
      httpOnly: true,
      secure: true,
    })
    res.status(200).json({
      accessToken: accessJwtToken,
    })
  }

  private async logout(req: Request, res: Response) {
    const {
      context: {
        user: { id },
        token: { deviceId },
      },
    } = req

    await this.securityDevicesService.deleteRefreshTokenMeta({
      userId: id,
      deviceId,
    })

    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME)
    res.sendStatus(204)
  }

  private async getMe(req: Request, res: Response) {
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

  private async registration(
    req: Request<{}, {}, CreateUserDto>,
    res: Response
  ) {
    const { body } = req

    const result = await this.authService.registration(body)

    if (!result) {
      res.sendStatus(400)
      return
    }

    res.sendStatus(204)
  }

  private async registrationConfirmation(
    req: Request<{}, {}, RegConfirmAuthDto>,
    res: Response
  ) {
    const {
      body: { code },
    } = req

    await this.authService.confirmEmail(code)

    res.sendStatus(204)
  }

  private async registrationEmailResending(
    req: Request<{}, {}, BaseUserDto>,
    res: Response
  ) {
    const {
      body: { email },
    } = req

    await this.authService.registrationEmailResending(email)

    res.sendStatus(204)
  }
}

export { AuthController }
