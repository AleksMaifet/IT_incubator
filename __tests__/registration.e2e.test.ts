import { disconnect } from 'mongoose'
import request from 'supertest'
import * as nodemailer from 'nodemailer'
import { NodemailerMock } from 'nodemailer-mock'
import { load } from 'cheerio'
import { boot } from '../src/main'
import { App } from '../src/app'

const { mock } = nodemailer as unknown as NodemailerMock
let application: App

beforeAll(async () => {
  const { app } = boot

  application = app

  await request(application.app).delete('/testing/all-data').expect(204)
})

describe('Registration', () => {
  it('POST -> "auth/registration": should create a new user and send a confirmation email with a code', async () => {
    const email = 'test@mail.com'

    const res = await request(application.app).post('/auth/registration').send({
      email,
      login: 'ulogin45',
      password: 'ulogin45',
    })

    const sentEmails = mock.getSentMail()
    const html = sentEmails[0].html as string
    const $ = load(html)
    const link = $('a').attr('href')
    const url = new URL(link!)
    const queryParams = new URLSearchParams(url.search)
    const code = queryParams.get('code')

    expect(sentEmails.length).toBe(1)
    expect(res.status).toBe(204)
    expect(sentEmails[0].to).toBe(email)
    expect(code).toBeTruthy()
  })
})

afterAll(async () => {
  await request(application.app).delete('/testing/all-data').expect(204)
  await disconnect()
  application.close()
})
