import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { parse } from 'useragent'
import { BaseController } from '../common'
import {
  AuthBearerMiddlewareGuard,
  AuthCredentialRefreshTokenMiddlewareGuard,
  AuthRefreshTokenMiddlewareGuard,
  RateLimitMiddleware,
  ValidateBodyMiddleware,
} from '../middlewares'
import { TYPES } from '../types'
import { BaseUserDto, CreateUserDto } from '../users'
import { JwtService } from '../services'
import { IRefreshTokenMeta, SecurityDevicesService } from '../securityDevices'
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
        new RateLimitMiddleware(5, 10000),
        new ValidateBodyMiddleware(BaseAuthDto),
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
        new RateLimitMiddleware(5, 10000),
        new ValidateBodyMiddleware(CreateUserDto),
      ],
    })
    this.bindRoutes({
      path: '/registration-confirmation',
      method: 'post',
      func: this.registrationConfirmation,
      middlewares: [
        new RateLimitMiddleware(5, 10000),
        new ValidateBodyMiddleware(RegConfirmAuthDto),
      ],
    })
    this.bindRoutes({
      path: '/registration-email-resending',
      method: 'post',
      func: this.registrationEmailResending,
      middlewares: [
        new RateLimitMiddleware(5, 10000),
        new ValidateBodyMiddleware(RegEmailResendingAuthDto),
      ],
    })
  }

  private _generatePairAuthTokens = async (
    dto: Pick<IRefreshTokenMeta, 'userId' | 'deviceName' | 'clientIp'>
  ) => {
    const { userId, deviceName, clientIp } = dto

    const deviceNameFamily = parse(deviceName).family

    const accessJwtData = this.jwtService.generateAccessToken(userId)
    const refreshJwtToken = this.jwtService.generateRefreshToken(userId)
    const payload = this.jwtService.getJwtDataByToken(refreshJwtToken)

    const { deviceId, iat, exp } = payload

    await this.securityDevicesService.createRefreshTokenMeta({
      userId,
      deviceId,
      issuedAt: iat,
      expirationAt: exp,
      deviceName: deviceNameFamily,
      clientIp: clientIp,
    })

    return {
      accessJwtData,
      refreshJwtToken,
    }
  }

  private login = async (req: Request<{}, {}, BaseAuthDto>, res: Response) => {
    const { body, headers, ip } = req

    await this.securityDevicesService.deleteExpiredRefreshToken()

    const userId = await this.authService.login(body)

    if (!userId) {
      res.sendStatus(401)
      return
    }

    const { accessJwtData, refreshJwtToken } =
      await this._generatePairAuthTokens({
        userId,
        deviceName: headers['user-agent']!,
        clientIp: ip!,
      })

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshJwtToken, {
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
      headers,
      ip,
    } = req

    const { accessJwtData, refreshJwtToken } =
      await this._generatePairAuthTokens({
        userId: id,
        deviceName: headers['user-agent']!,
        clientIp: ip!,
      })

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshJwtToken, {
      httpOnly: true,
      secure: true,
    })
    res.status(200).json(accessJwtData)
  }

  private logout = async (_: Request, res: Response) => {
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
