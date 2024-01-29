import { disconnect } from 'mongoose'
import request from 'supertest'
import { application, makeAuthBasicRequest } from './helpers'
import { DEFAULT_TEST_DATA } from './data'

const { USER_DATA } = DEFAULT_TEST_DATA

const invalidId = '00000000000000'
const pageNumber = 1
const pageSize = 10

beforeAll(async () => {
  await request(application.app).delete('/testing/all-data').expect(204)
})

describe('Users', () => {
  it('POST -> "/users": should create a new user', async () => {
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

  it('DELETE -> "/testing/all-data": should remove all data', async () => {
    await request(application.app).delete('/testing/all-data').expect(204)
  })

  it('GET -> "/users": should return users array with pagination', async () => {
    await makeAuthBasicRequest(
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
    await request(application.app).post('/users').send(USER_DATA).expect(401)
  })

  it('DELETE -> "/users/:id": should delete user by id', async () => {
    const response = await makeAuthBasicRequest(
      application.app,
      'post',
      '/users',
      USER_DATA
    )

    await makeAuthBasicRequest(
      application.app,
      'delete',
      `/users/${response.body.id}`
    ).expect(204)
  })

  it('DELETE -> "/users/:id": should return an error if :id is not found', async () => {
    await makeAuthBasicRequest(
      application.app,
      'delete',
      `/users/${invalidId}`
    ).expect(404)
  })

  it('POST -> "/users": should return an error if passed body is incorrect', async () => {
    await makeAuthBasicRequest(application.app, 'post', '/users', {
      ...USER_DATA,
      login: '1',
      password: USER_DATA.email,
    }).expect(400)
  })
})

afterAll(async () => {
  await request(application.app).delete('/testing/all-data').expect(204)
  await disconnect()
  application.close()
})
