import { disconnect } from 'mongoose'
import request from 'supertest'
import { sign } from 'jsonwebtoken'
import { boot } from '../src/main'
import { App } from '../src/app'
import { makeAuthBasicRequest, makeAuthBearerRequest } from './index'

let application: App
const userData = {
  login: '37ukNrWNgG',
  password: 'string',
  email:
    '_mrkPmUcMJP2tlbPWUk6BCrgMnOi4mDQoaAU26biSxkYwNFnvlm2OfQvoUEt4axNefIaUmSiRgyC@3gTGCstAJzDfaqSuVgo4TAv4ysYRp' +
    '.SnIrhf7Cc1Pz4PofoT2get_zNk3tNwWbM_jFKUcY.ygD',
}
beforeAll(async () => {
  const { app } = boot

  application = app

  await request(application.app).delete('/testing/all-data').expect(204)
})

describe('Auth', () => {
  it('POST -> "/users": should create a new user', async () => {
    await makeAuthBasicRequest(
      application.app,
      'post',
      '/users',
      userData
    ).expect(201)
  })

  it('POST -> "/auth/login": should sign in user', async () => {
    const res = await request(application.app)
      .post('/auth/login')
      .send({
        loginOrEmail: userData.email,
        password: userData.password,
      })
      .expect(200)

    expect(res.body).toHaveProperty('accessToken')
  })

  it('POST -> "/auth/login": should return an error if passed wrong login or password', async () => {
    await request(application.app)
      .post('/auth/login')
      .send({
        loginOrEmail: userData.login,
        password: '1',
      })
      .expect(401)
  })

  it('GET -> "/auth/me": should return user info', async () => {
    const resLogin = await request(application.app).post('/auth/login').send({
      loginOrEmail: userData.login,
      password: userData.password,
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
