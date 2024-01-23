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
    const { id, email, login } = user

    const newEmailConfirmation = new EmailConfirmation(id)
    const { code } = newEmailConfirmation

    await this.authRepository.createEmailConfirmation(newEmailConfirmation)

    return await this._sendEmailConfirmationCode({ id, email, login, code })
  }

  public confirmEmail = async (code: string) => {
    return await this.authRepository.updateConfirmationByCode(code)
  }

  public registrationEmailResending = async (email: string) => {
    const user = await this.usersRepository.getByLoginOrEmail(email)

    const { id, login, email: userEmail } = user!

    const confirmation =
      await this.authRepository.getConfirmationByCodeOrUserId(id)

    if (!confirmation) return false

    const { isConfirmed } = confirmation

    if (isConfirmed) return false

    const newConfirmation = await this.authRepository.updateConfirmationCode(id)

    if (!newConfirmation) return false

    const { code } = newConfirmation

    return await this._sendEmailConfirmationCode({
      id,
      email: userEmail,
      login,
      code,
    })
  }

  private _sendEmailConfirmationCode = async (
    user: Pick<IUser, 'id' | 'login' | 'email'> & { code: string }
  ) => {
    const { id, login, email, code } = user

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
