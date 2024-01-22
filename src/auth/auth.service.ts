import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { CreateUserDto, IUser, UsersService } from '../users'
import { ManagerEmail } from '../managers'
import { BaseAuthDto } from './dto'
import { AuthRepository } from './auth.repository'

@injectable()
class AuthService {
  constructor(
    @inject(TYPES.UsersService)
    private readonly usersService: UsersService,
    @inject(TYPES.AuthRepository)
    private readonly authRepository: AuthRepository,
    @inject(TYPES.ManagerEmail)
    private readonly managerEmail: ManagerEmail
  ) {}

  public login = async (dto: BaseAuthDto) => {
    const { loginOrEmail, password } = dto

    const user = await this.authRepository.getByLoginOrEmail(loginOrEmail)

    if (!user) return false

    const passwordHash = await this.usersService.generateHash(
      password,
      user.passwordSalt
    )

    if (passwordHash !== user.passwordHash) {
      return false
    }

    return this._mapGenerateUserResponse(user)
  }

  public registration = (dto: CreateUserDto) => {
    const { login, email } = dto

    this.managerEmail.sendUserConfirmationCode({ login, email })
  }

  private _mapGenerateUserResponse = (user: IUser) => {
    const { id, login, email, createdAt } = user

    return {
      id,
      login,
      email,
      createdAt,
    }
  }
}

export { AuthService }
