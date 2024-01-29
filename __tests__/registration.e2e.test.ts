import { disconnect } from 'mongoose'
import request from 'supertest'
import { DEFAULT_TEST_DATA } from './data'
import { application, mock, parsedHtmlAndGetCode } from './helpers'

const { USER_DATA } = DEFAULT_TEST_DATA

let code: string

beforeAll(async () => {
  await request(application.app).delete('/testing/all-data').expect(204)
})

afterEach(async () => {
  mock.reset()
})

describe('Registration', () => {
  it('POST -> "auth/registration": should create a new user and send a confirmation email with a code', async () => {
    const res = await request(application.app)
      .post('/auth/registration')
      .send(USER_DATA)

    const sentEmails = mock.getSentMail()
    const html = sentEmails[0].html as string
    code = parsedHtmlAndGetCode(html, 'code')

    expect(sentEmails.length).toBe(1)
    expect(res.status).toBe(204)
    expect(sentEmails[0].to).toBe(USER_DATA.email)
    expect(code).toBeTruthy()
  })

  it('POST -> "/auth/registration": should return error if email or login already exist; status 400', async () => {
    await request(application.app)
      .post('/auth/registration')
      .send(USER_DATA)
      .expect(400)
  })

  it('POST -> "/auth/registration-email-resending": should send email with new code if user exists but not confirmed yet; status 204', async () => {
    await request(application.app)
      .post('/auth/registration-email-resending')
      .send({
        email: USER_DATA.email,
      })
      .expect(204)

    const sentEmails = mock.getSentMail()
    const html = sentEmails[0].html as string
    code = parsedHtmlAndGetCode(html, 'code')
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
