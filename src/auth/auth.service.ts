import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { CreateUserDto, IUser, UsersRepository, UsersService } from '../users'
import { ManagerEmail } from '../managers'
import {
  EmailConfirmation,
  PasswordRecoveryConfirmationEntity,
} from './entities'
import { BaseAuthDto, UpdatePassDto } from './dto'
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

  private async _sendEmailConfirmationCode(
    user: Pick<IUser, 'id' | 'login' | 'email'> & { code: string }
  ) {
    const { id, login, email, code } = user

    try {
      const info = await this.managerEmail.sendUserEmailConfirmationCode({
        login,
        email,
        code,
      })

      this.loggerService.log('Message sent ' + info.response)
      return true
    } catch (error) {
      this.loggerService.error(`NodeMailer ${error}`)

      await this.usersService.deleteById(id)
      await this.authRepository.deleteEmailConfirmationByUserId(id)
      return null
    }
  }

  private async _sendPasswordRecoveryConfirmationCode(
    user: Pick<IUser, 'id' | 'login' | 'email'> & { code: string }
  ) {
    const { id, login, email, code } = user

    try {
      const info = await this.managerEmail.sendPasswordRecoveryConfirmationCode(
        {
          login,
          email,
          code,
        }
      )

      this.loggerService.log('Message sent ' + info.response)
      return true
    } catch (error) {
      this.loggerService.error(`NodeMailer ${error}`)

      await this.authRepository.deletePasswordRecoveryConfirmationByUserId(id)
      return null
    }
  }

  public async login(dto: BaseAuthDto) {
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

  public async passwordRecovery(email: string) {
    const user = await this.usersRepository.getByLoginOrEmail(email)

    if (!user) return false

    const { id, login } = user

    const newPasswordRecoveryConfirmation =
      new PasswordRecoveryConfirmationEntity(id)
    const { code } = newPasswordRecoveryConfirmation

    await this.authRepository.passwordRecoveryConfirmation(
      newPasswordRecoveryConfirmation
    )

    return await this._sendPasswordRecoveryConfirmationCode({
      id,
      email,
      login,
      code,
    })
  }

  public async updateUserPassword(dto: UpdatePassDto) {
    const { recoveryCode, newPassword } = dto

    const confirmation =
      await this.authRepository.getPasswordRecoveryConfirmationByCode(
        recoveryCode
      )

    const userId = confirmation!.userId

    await this.authRepository.deletePasswordRecoveryConfirmationByUserId(userId)

    return await this.usersService.updatePassword({
      userId,
      newPassword,
    })
  }

  public async registration(dto: CreateUserDto) {
    const user = await this.usersService.create(dto)
    const { id, email, login } = user

    const newEmailConfirmation = new EmailConfirmation(id)
    const { code } = newEmailConfirmation

    await this.authRepository.createEmailConfirmation(newEmailConfirmation)

    return await this._sendEmailConfirmationCode({ id, email, login, code })
  }

  public async confirmEmail(code: string) {
    return await this.authRepository.deleteEmailConfirmationByCode(code)
  }

  public async registrationEmailResending(email: string) {
    const user = await this.usersRepository.getByLoginOrEmail(email)

    const { id, login, email: userEmail } = user!

    const newConfirmation =
      await this.authRepository.updateEmailConfirmationCode(id)

    const { code } = newConfirmation!

    return await this._sendEmailConfirmationCode({
      id,
      email: userEmail,
      login,
      code,
    })
  }
}

export { AuthService }
