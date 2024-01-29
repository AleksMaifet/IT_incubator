import { disconnect } from 'mongoose'
import request from 'supertest'
import { DEFAULT_TEST_DATA } from './data'
import {
  application,
  delay,
  getRefreshToken,
  makeAuthBasicRequest,
  mock,
  parsedHtmlAndGetCode,
} from './helpers'

const { USER_DATA } = DEFAULT_TEST_DATA

let code: string
const newPassword = `new${USER_DATA.password}`

beforeAll(async () => {
  await request(application.app).delete('/testing/all-data').expect(204)
})

afterEach(async () => {
  mock.reset()
})

describe('Password recovery', () => {
  it(
    'POST -> "/users": should create new user; status 201; content: created user; ' +
      'used additional methods: GET => /users;',
    async () => {
      const response = await makeAuthBasicRequest(
        application.app,
        'post',
        '/users',
        USER_DATA
      ).expect(201)

      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('login')
      expect(response.body).toHaveProperty('createdAt')
      expect(response.body).toHaveProperty('email')
    }
  )

  it('POST -> "auth/password-recovery": should send email with recovery code; status 204;', async () => {
    const response = await request(application.app)
      .post('/auth/password-recovery')
      .send({ email: USER_DATA.email })

    const sentEmails = mock.getSentMail()
    const html = sentEmails[0].html as string
    code = parsedHtmlAndGetCode(html, 'recoveryCode')

    expect(sentEmails.length).toBe(1)
    expect(response.status).toBe(204)
    expect(sentEmails[0].to).toBe(USER_DATA.email)
    expect(code).toBeTruthy()
  })

  it('POST -> "auth/new-password": should return error if password is incorrect; status 400;', async () => {
    await request(application.app)
      .post('/auth/new-password')
      .send({
        newPassword: USER_DATA.password[0],
        recoveryCode: code,
      })
      .expect(400)
  })

  it('POST -> "auth/new-password": should confirm password recovery; status 204;', async () => {
    await request(application.app)
      .post('/auth/new-password')
      .send({
        newPassword,
        recoveryCode: code,
      })
      .expect(204)
  })

  it(
    'POST -> "auth/password-recovery": should return status 204 even if such email doesnt exist; ' +
      'status 204;',
    async () => {
      await request(application.app)
        .post('/auth/password-recovery')
        .send({ email: 'nonexistent@example.com' })
        .expect(204)
    }
  )

  it('POST -> "/auth/login": should sign in user with new password; status 200; content: JWT token;', async () => {
    const res = await request(application.app).post('/auth/login').send({
      loginOrEmail: USER_DATA.email,
      password: newPassword,
    })

    const refreshToken = getRefreshToken(res.get('Set-Cookie'))

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('accessToken')
    expect(refreshToken).toBeTruthy()
    expect(refreshToken.includes('HttpOnly')).toBeTruthy()
    expect(refreshToken.includes('Secure')).toBeTruthy()
  })

  it(
    'POST -> "/auth/password-recovery": it should return status code 429 if more than 5 ' +
      'requests were sent within 10 seconds, and 204 after waiting; status 429, 204;',
    async () => {
      for (let i = 0; i < 6; i++) {
        const res = await request(application.app)
          .post('/auth/password-recovery')
          .send({ email: USER_DATA.email })

        if (i === 5) {
          expect(res.status).toBe(429)
        }
      }

      // Wait for 10 seconds
      await delay(10000)

      // Send another request
      await request(application.app)
        .post('/auth/password-recovery')
        .send({ email: USER_DATA.email })
        .expect(204)
    }
  )

  it(
    'POST -> "/auth/new-password": it should return status code 429 if more than 5 requests ' +
      'were sent within 10 seconds, and 400 after waiting; status 429, 400;',
    async () => {
      for (let i = 0; i < 6; i++) {
        const res = await request(application.app)
          .post('/auth/new-password')
          .send({
            newPassword,
            recoveryCode: code,
          })

        if (i === 5) {
          expect(res.status).toBe(429)
        }
      }

      // Wait for 10 seconds
      await delay(10000)

      // Send another request
      await request(application.app)
        .post('/auth/new-password')
        .send({
          newPassword,
          recoveryCode: code,
        })
        .expect(400)
    }
  )
})

afterAll(async () => {
  await request(application.app).delete('/testing/all-data').expect(204)
  await disconnect()
  application.close()
})
