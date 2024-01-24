import { disconnect } from 'mongoose'
import request from 'supertest'
import * as nodemailer from 'nodemailer'
import { NodemailerMock } from 'nodemailer-mock'
import { load } from 'cheerio'
import { boot } from '../src/main'
import { App } from '../src/app'

const { mock } = nodemailer as unknown as NodemailerMock
let application: App
const email = 'test@mail.com'
const login = 'ulogin45'
let code: string

const parsedHtmlAndGetCode = (html: string) => {
  const $ = load(html)
  const link = $('a').attr('href')
  const url = new URL(link!)
  const queryParams = new URLSearchParams(url.search)
  return queryParams.get('code')!
}

beforeAll(async () => {
  const { app } = boot

  application = app

  await request(application.app).delete('/testing/all-data').expect(204)
})

afterEach(async () => {
  mock.reset()
})

describe('Registration', () => {
  it('POST -> "auth/registration": should create a new user and send a confirmation email with a code', async () => {
    const res = await request(application.app).post('/auth/registration').send({
      email,
      login,
      password: 'ulogin45',
    })

    const sentEmails = mock.getSentMail()
    const html = sentEmails[0].html as string
    code = parsedHtmlAndGetCode(html)

    expect(sentEmails.length).toBe(1)
    expect(res.status).toBe(204)
    expect(sentEmails[0].to).toBe(email)
    expect(code).toBeTruthy()
  })

  it('POST -> "/auth/registration": should return error if email or login already exist; status 400', async () => {
    await request(application.app)
      .post('/auth/registration')
      .send({
        email,
        login,
        password: 'password123',
      })
      .expect(400)
  })

  it('POST -> "/auth/registration-email-resending": should send email with new code if user exists but not confirmed yet; status 204', async () => {
    await request(application.app)
      .post('/auth/registration-email-resending')
      .send({
        email,
      })
      .expect(204)

    const sentEmails = mock.getSentMail()
    const html = sentEmails[0].html as string
    code = parsedHtmlAndGetCode(html)
  })

  it('POST -> "/auth/registration-confirmation": should confirm registration by email; status 204', async () => {
    await request(application.app)
      .post('/auth/registration-confirmation')
      .send({
        code,
      })
      .expect(204)
  })

  it('POST -> "/auth/registration-confirmation": should return error if code already confirmed; status 400', async () => {
    await request(application.app)
      .post('/auth/registration-confirmation')
      .send({
        code,
      })
      .expect(400)
  })
})

afterAll(async () => {
  await request(application.app).delete('/testing/all-data').expect(204)
  await disconnect()
  application.close()
})
