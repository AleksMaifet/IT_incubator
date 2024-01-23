import { createTransport } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TYPES } from '../types'
import { ConfigService } from '../services'

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

  public sendConfirmationCode = async (dto: {
    email: string
    subject: string
    html: string
  }) => {
    const { email, subject, html } = dto

    const user = this.configService.get('EMAIL_USER').toString()
    const mailOptions = {
      // Sender address
      from: `"It_Incubator 👻" <${user}>`,
      // list of receivers
      to: email,
      // Subject line
      subject,
      // Html body
      html,
    }

    return await this._email.sendMail(mailOptions)
  }
}

export { AdapterEmail }
