import { disconnect } from 'mongoose'
import request from 'supertest'
import { boot } from '../src/main'
import { App } from '../src/app'
import { makeAuthRequest } from './index'

let application: App
const invalidId = '00000000000000'
const pageNumber = 1
const pageSize = 10
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

describe('Users', () => {
  it('POST -> "/users": should create a new user', async () => {
    const response = await makeAuthRequest(
      application.app,
      'post',
      '/users',
      userData
    ).expect(201)

    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('login')
    expect(response.body).toHaveProperty('createdAt')
    expect(response.body).toHaveProperty('email')
  })

  it('DELETE -> "/testing/all-data": should remove all data', async () => {
    await request(application.app).delete('/testing/all-data').expect(204)
  })

  it('GET -> "/users": should return users array with pagination', async () => {
    await makeAuthRequest(
      application.app,
      'get',
      `/users?pageNumber=${pageNumber}&pageSize=${pageSize}`
    )
      .expect(200)
      .expect((response) => {
        expect(response.body).toMatchObject({
          pagesCount: 0,
          page: pageNumber,
          pageSize: pageSize,
          totalCount: 0,
          items: [],
        })
      })
  })

  it('POST-> "/users": should return an error if auth credentials are incorrect', async () => {
    await request(application.app).post('/users').send(userData).expect(401)
  })

  it('DELETE -> "/users/:id": should delete user by id', async () => {
    const response = await makeAuthRequest(
      application.app,
      'post',
      '/users',
      userData
    )

    await makeAuthRequest(
      application.app,
      'delete',
      `/users/${response.body.id}`
    ).expect(204)
  })

  it('DELETE -> "/users/:id": should return an error if :id is not found', async () => {
    await makeAuthRequest(
      application.app,
      'delete',
      `/users/${invalidId}`
    ).expect(404)
  })

  it('POST -> "/users": should return an error if passed body is incorrect', async () => {
    await makeAuthRequest(application.app, 'post', '/users', {
      ...userData,
      login: '1',
      password: userData.email,
    }).expect(400)
  })
})

describe('Auth', () => {
  it('POST -> "/users": should create a new user', async () => {
    await makeAuthRequest(application.app, 'post', '/users', userData).expect(
      201
    )
  })

  it('POST -> "/auth/login": should sign in user', async () => {
    await request(application.app)
      .post('/auth/login')
      .send({
        loginOrEmail: userData.email,
        password: userData.password,
      })
      .expect(204)
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
})

afterAll(async () => {
  await request(application.app).delete('/testing/all-data').expect(204)
  await disconnect()
  application.close()
})
