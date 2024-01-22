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

  public sendUserConfirmationCode = (
    dto: Pick<CreateUserDto, 'login' | 'email'>
  ) => {
    return this.adapterEmail.sendConfirmationCode(dto)
  }
}

export { ManagerEmail }
