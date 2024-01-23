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
    dto: Pick<CreateUserDto, 'login' | 'email'> & { code: string }
  ) => {
    const { login, email, code } = dto

    const subject = 'Confirm Account'
    const html =
      `<h1>Thanks for your registration ${login}</h1> ` +
      '<div>' +
      '<p>To finish registration please follow the link below: ' +
      `<a href="https://localhost:3000/confirm-email?code=${code}">complete registration</a>` +
      '</p>' +
      '</div>'

    return await this.adapterEmail.sendConfirmationCode({
      email,
      subject,
      html,
    })
  }
}

export { ManagerEmail }
