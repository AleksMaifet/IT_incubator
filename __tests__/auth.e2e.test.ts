import { disconnect } from 'mongoose'
import request from 'supertest'
import { sign } from 'jsonwebtoken'
import {
  application,
  makeAuthBasicRequest,
  makeAuthBearerRequest,
} from './helpers'
import { DEFAULT_TEST_DATA } from './data'

const { USER_DATA } = DEFAULT_TEST_DATA

beforeAll(async () => {
  await request(application.app).delete('/testing/all-data').expect(204)
})

describe('Auth', () => {
  it('POST -> "/users": should create a new user', async () => {
    await makeAuthBasicRequest(
      application.app,
      'post',
      '/users',
      USER_DATA
    ).expect(201)
  })

  it('POST -> "/auth/login": should sign in user', async () => {
    const res = await request(application.app).post('/auth/login').send({
      loginOrEmail: USER_DATA.email,
      password: USER_DATA.password,
    })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('accessToken')
  })

  it('POST -> "/auth/login": should return an error if passed wrong login or password', async () => {
    await request(application.app)
      .post('/auth/login')
      .send({
        loginOrEmail: USER_DATA.login,
        password: '1',
      })
      .expect(401)
  })

  it('GET -> "/auth/me": should return user info', async () => {
    const resLogin = await request(application.app).post('/auth/login').send({
      loginOrEmail: USER_DATA.login,
      password: USER_DATA.password,
    })

    const resMe = await makeAuthBearerRequest(
      application.app,
      'get',
      resLogin.body.accessToken,
      '/auth/me'
    ).expect(200)

    expect(resMe.body).toHaveProperty('email')
    expect(resMe.body).toHaveProperty('login')
    expect(resMe.body).toHaveProperty('userId')
  })

  it('GET -> "/auth/me": should return an error if token wrong', async () => {
    const randomToken = sign(
      { userId: new Date().getMilliseconds().toString() },
      'secret'
    )

    await makeAuthBearerRequest(
      application.app,
      'get',
      randomToken,
      '/auth/me'
    ).expect(401)
  })
})

afterAll(async () => {
  await request(application.app).delete('/testing/all-data').expect(204)
  await disconnect()
  application.close()
})
