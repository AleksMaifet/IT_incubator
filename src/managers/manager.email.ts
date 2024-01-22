import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TYPES } from '../types'
import { AdapterEmail } from '../adapters'
import { CreateUserDto } from '../users'

@injectable()
class ManagerEmail {
  constructor(
    @inject(TYPES.AdapterEmail)
    private readonly adapterEmail: AdapterEmail
  ) {}

  public sendUserConfirmationCode = async (
    dto: Pick<CreateUserDto, 'login' | 'email'>
  ) => {
    await this.adapterEmail.sendConfirmationCode(dto)
  }
}

export { ManagerEmail }
