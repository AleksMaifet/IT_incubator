import { disconnect } from 'mongoose'
import request from 'supertest'
import { boot } from '../src/main'
import { App } from '../src/app'
import { makeAuthBasicRequest, makeAuthBearerRequest } from './auths'
import { DEFAULT_TEST_DATA } from './data'

const { USER_DATA } = DEFAULT_TEST_DATA
const REFRESH_TOKEN_NAME = 'refreshToken'
let application: App
let refreshToken_1: string
let refreshToken_2: string
let accessToken: string

const getRefreshToken = (arr: string[]) => {
  return arr.reduce((acc, c) => {
    if (!c.includes(REFRESH_TOKEN_NAME)) {
      return acc
    }

    return c.split(`${REFRESH_TOKEN_NAME}=`)[1]
  }, '' as string)
}

beforeAll(async () => {
  const { app } = boot

  application = app

  await request(application.app).delete('/testing/all-data').expect(204)
})

describe('RefreshToken', () => {
  it('POST -> "/users": should create new user; status 201; content: created user; used additional methods: GET => /users;', async () => {
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
  })

  it('POST -> "/auth/login": should sign in user; status 200; content: JWT "access" token, JWT "refresh" token in cookie (http only, secure);', async () => {
    const response = await request(application.app).post('/auth/login').send({
      loginOrEmail: USER_DATA.email,
      password: USER_DATA.password,
    })

    refreshToken_1 = getRefreshToken(response.get('Set-Cookie'))

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('accessToken')
    expect(refreshToken_1).toBeTruthy()
    expect(refreshToken_1.includes('HttpOnly')).toBeTruthy()
    expect(refreshToken_1.includes('Secure')).toBeTruthy()
  })

  it('POST -> "/auth/me": should return the error when the "access" token has expired or there is none in the headers; status 401;', async () => {
    await makeAuthBearerRequest(application.app, 'get', '', '/auth/me').expect(
      401
    )
  })

  it('POST -> "/auth/refresh-token", "/auth/logout": should return an error when the "refresh" token has expired or there is none in the cookie; status 401;', async () => {
    await request(application.app).post('/auth/refresh-token').expect(401)
  })

  it('POST -> "/auth/refresh-token": should return new "refresh" and "access" tokens; status 200; content: new JWT "access" token, new JWT "refresh" token in cookie (http only, secure);', async () => {
    await new Promise((_) => setTimeout(_, 1000))

    const response = await request(application.app)
      .post('/auth/refresh-token')
      .set('Cookie', `refreshToken=${refreshToken_1}`)

    refreshToken_2 = getRefreshToken(response.get('Set-Cookie'))
    accessToken = response.body.accessToken

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('accessToken')
    expect(refreshToken_2).toBeTruthy()
    expect(refreshToken_2.includes('HttpOnly')).toBeTruthy()
    expect(refreshToken_2.includes('Secure')).toBeTruthy()
  })

  it('POST -> "/auth/refresh-token", "/auth/logout": should return an error if the "refresh" token has become invalid; status 401;', async () => {
    await request(application.app)
      .post('/auth/refresh-token')
      .set('Cookie', `refreshToken=${refreshToken_1}`)
      .expect(401)
  })

  it('POST -> "/auth/me": should check "access" token and return current user data; status 200; content: current user data;', async () => {
    const response = await makeAuthBearerRequest(
      application.app,
      'get',
      accessToken,
      '/auth/me'
    )

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('email')
    expect(response.body).toHaveProperty('login')
    expect(response.body).toHaveProperty('userId')
  })

  it('POST -> "/auth/logout": should make the "refresh" token invalid; status 204;', async () => {
    await request(application.app)
      .post('/auth/logout')
      .set('Cookie', `refreshToken=${refreshToken_2}`)
      .expect(204)
  })

  it('POST -> "/auth/refresh-token", "/auth/logout": should return an error when the "refresh" token has expired or there is none in the cookie; status 401;', async () => {
    await request(application.app)
      .post('/auth/refresh-token')
      .set('Cookie', `refreshToken=${refreshToken_2}`)
      .expect(401)
  })
})

afterAll(async () => {
  await request(application.app).delete('/testing/all-data').expect(204)
  await disconnect()
  application.close()
})
