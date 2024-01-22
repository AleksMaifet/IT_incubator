import { createTransport } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TYPES } from '../types'
import { ConfigService, LoggerService } from '../services'
import { CreateUserDto } from '../users'

@injectable()
class AdapterEmail {
  private _email: Mail

  constructor(
    @inject(TYPES.ConfigService)
    private readonly configService: ConfigService,
    @inject(TYPES.ILogger)
    private readonly loggerService: LoggerService
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
    dto: Pick<CreateUserDto, 'login' | 'email'>
  ) => {
    const { login, email } = dto

    //TODO added login/email and code

    const user = this.configService.get('EMAIL_USER').toString()
    const mailOptions = {
      // Sender address
      from: `"It_Incubator 👻" <${user}>`,
      // list of receivers
      to: 'aleksmaifet@gmail.com',
      // Subject line
      subject: 'Confirm Account',
      // Html body
      html:
        '<h1>Thanks for your registration</h1> ' +
        '<div>' +
        '<p>To finish registration please follow the link below: ' +
        '<a href="https://localhost:3000?code=blablalba">complete registration</a>' +
        '</p>' +
        '</div>',
    }

    try {
      const info = await this._email.sendMail(mailOptions)

      this.loggerService.log('Message sent ' + info.response)
    } catch (error) {
      this.loggerService.error(`NodeMailer ${error}`)
    }
  }
}

export { AdapterEmail }
