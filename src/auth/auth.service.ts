import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { UsersService, IUser } from '../users'
import { BaseLoginDto } from './dto'
import { AuthRepository } from './auth.repository'

@injectable()
class AuthService {
  constructor(
    @inject(TYPES.UsersService)
    private readonly usersService: UsersService,
    @inject(TYPES.AuthRepository)
    private readonly authRepository: AuthRepository
  ) {}

  public login = async (dto: BaseLoginDto) => {
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
