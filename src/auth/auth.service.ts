import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { CreateUserDto, IUser, UsersRepository, UsersService } from '../users'
import { ManagerEmail } from '../managers'
import { EmailConfirmation } from './emailConfirmation.entity'
import { BaseAuthDto } from './dto'
import { AuthRepository } from './auth.repository'
import { LoggerService } from '../services'

@injectable()
class AuthService {
  constructor(
    @inject(TYPES.UsersService)
    private readonly usersService: UsersService,
    @inject(TYPES.AuthRepository)
    private readonly authRepository: AuthRepository,
    @inject(TYPES.UsersRepository)
    private readonly usersRepository: UsersRepository,
    @inject(TYPES.ManagerEmail)
    private readonly managerEmail: ManagerEmail,
    @inject(TYPES.ILogger)
    private readonly loggerService: LoggerService
  ) {}

  public login = async (dto: BaseAuthDto) => {
    const { loginOrEmail, password } = dto

    const user = await this.usersRepository.getByLoginOrEmail(loginOrEmail)

    if (!user) return false

    const passwordHash = await this.usersService.generateHash(
      password,
      user.passwordSalt
    )

    if (passwordHash !== user.passwordHash) {
      return false
    }

    return user.id
  }

  public registration = async (dto: CreateUserDto) => {
    const user = await this.usersService.create(dto)
    const { id } = user

    const newEmailConfirmation = new EmailConfirmation(id)
    const { code } = newEmailConfirmation

    await this.authRepository.createEmailConfirmation(newEmailConfirmation)

    return await this._sendEmailConfirmationCode(user, code)
  }

  public confirmEmail = async (code: string) => {
    const result = await this.authRepository.getConfirmationByCodeOrUserId(code)

    switch (true) {
      case !result:
        return false
      case result!.expiresIn < new Date():
        return false
      case result!.isConfirmed:
        return false
      default:
        return await this.authRepository.updateConfirmationByCode(code)
    }
  }

  public registrationEmailResending = async (email: string) => {
    const user = await this.usersRepository.getByLoginOrEmail(email)

    if (!user) return false

    const { id } = user

    const result = await this.authRepository.getConfirmationByCodeOrUserId(id)

    if (!result) return false

    const { code, isConfirmed } = result

    if (isConfirmed) return false

    return await this._sendEmailConfirmationCode(user, code)
  }

  private _sendEmailConfirmationCode = async (
    user: Omit<IUser, 'passwordSalt' | 'passwordHash'>,
    code: string
  ) => {
    const { id, login, email } = user

    try {
      const info = await this.managerEmail.sendUserConfirmationCode({
        login,
        email,
        code,
      })

      this.loggerService.log('Message sent ' + info.response)
      return true
    } catch (error) {
      this.loggerService.error(`NodeMailer ${error}`)

      await this.usersService.deleteById(id)
      await this.authRepository.deleteEmailConfirmation(id)
      return null
    }
  }
}

export { AuthService }
