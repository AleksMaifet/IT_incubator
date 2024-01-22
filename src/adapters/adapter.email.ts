import { createTransport } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TYPES } from '../types'
import { ConfigService } from '../services'
import { CreateUserDto } from '../users'

@injectable()
class AdapterEmail {
  private _email: Mail

  constructor(
    @inject(TYPES.ConfigService)
    private readonly configService: ConfigService
  ) {
    const service = this.configService.get('EMAIL_SERVICE').toString()
    const user = this.configService.get('EMAIL_USER').toString()
    const pass = this.configService.get('EMAIL_PASSWORD').toString()

    this._email = createTransport({
      service,
      auth: {
        user,
        pass,
      },
    })
  }

  public sendConfirmationCode = async (
    dto: Pick<CreateUserDto, 'login' | 'email'> & { code: string }
  ) => {
    const { login, email, code } = dto

    const user = this.configService.get('EMAIL_USER').toString()
    const mailOptions = {
      // Sender address
      from: `"It_Incubator 👻" <${user}>`,
      // list of receivers
      to: email,
      // Subject line
      subject: 'Confirm Account',
      // Html body
      html:
        `<h1>Thanks for your registration ${login}</h1> ` +
        '<div>' +
        '<p>To finish registration please follow the link below: ' +
        `<a href="https://localhost:3000?code=${code}">complete registration</a>` +
        '</p>' +
        '</div>',
    }

    return await this._email.sendMail(mailOptions)
  }
}

export { AdapterEmail }
