import request from 'supertest'
import { disconnect } from 'mongoose'
import { boot } from '../src/main'
import { App } from '../src/app'
import { makeAuthBasicRequest, makeAuthBearerRequest } from './helpers'
import { DEFAULT_TEST_DATA } from './data'

const { USER_DATA, BLOG_DATA, POST_DATA, COMMENT_DATA } = DEFAULT_TEST_DATA

let application: App
let jwt_token: string
let postId: string

beforeAll(async () => {
  const { app } = boot

  application = app

  await request(application.app).delete('/testing/all-data').expect(204)
  /// Created blog
  const blogRes = await makeAuthBasicRequest(
    application.app,
    'post',
    '/blogs',
    BLOG_DATA
  )
  /// Created post
  const postRes = await makeAuthBasicRequest(
    application.app,
    'post',
    '/posts',
    {
      ...POST_DATA,
      blogId: blogRes.body.id,
    }
  )
  /// Created user
  await makeAuthBasicRequest(application.app, 'post', '/users', USER_DATA)
  /// Login user
  const res = await request(application.app).post('/auth/login').send({
    loginOrEmail: USER_DATA.email,
    password: USER_DATA.password,
  })

  postId = postRes.body.id
  jwt_token = res.body.accessToken
})

describe('Comments for posts with auth', () => {
  it('POST -> "/posts/:postId/comments": should create new comment', async () => {
    const res = await makeAuthBearerRequest(
      application.app,
      'post',
      jwt_token,
      `/posts/${postId}/comments`,
      {
        content: COMMENT_DATA.content,
      }
    )

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.content).toBe(COMMENT_DATA.content)
  })

  it('GET -> "/posts/:postId/comments": should return comments with pagination', async () => {
    const res = await makeAuthBearerRequest(
      application.app,
      'get',
      jwt_token,
      `/posts/${postId}/comments`
    )

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('pagesCount')
    expect(res.body).toHaveProperty('page')
    expect(res.body).toHaveProperty('pageSize')
    expect(res.body).toHaveProperty('totalCount')
    expect(res.body).toHaveProperty('items')
  })

  it('DELETE -> "/comments/:id": should delete comment by id', async () => {
    const commentRes = await makeAuthBearerRequest(
      application.app,
      'post',
      jwt_token,
      `/posts/${postId}/comments`,
      {
        content: COMMENT_DATA.content,
      }
    )

    await makeAuthBearerRequest(
      application.app,
      'delete',
      jwt_token,
      `/comments/${commentRes.body.id}`
    ).expect(204)
  })

  it('PUT -> "/comments/:commentId": should update comment by id', async () => {
    const commentRes = await makeAuthBearerRequest(
      application.app,
      'post',
      jwt_token,
      `/posts/${postId}/comments`,
      {
        content: COMMENT_DATA.content,
      }
    )

    await makeAuthBearerRequest(
      application.app,
      'put',
      jwt_token,
      `/comments/${commentRes.body.id}`,
      {
        content: COMMENT_DATA.content + COMMENT_DATA.content,
      }
    ).expect(204)
  })

  it('GET -> "comments/:commentId": should return comment by id', async () => {
    const commentRes = await makeAuthBearerRequest(
      application.app,
      'post',
      jwt_token,
      `/posts/${postId}/comments`,
      {
        content: COMMENT_DATA.content,
      }
    )

    const res = await makeAuthBearerRequest(
      application.app,
      'get',
      jwt_token,
      `/comments/${commentRes.body.id}`
    )

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('id', commentRes.body.id)
    expect(res.body).toHaveProperty('content', COMMENT_DATA.content)
    expect(res.body).toHaveProperty('commentatorInfo')
    expect(res.body).toHaveProperty('createdAt')
  })

  it('DELETE. -> "/comments/:id": should return error if :id from uri param not found', async () => {
    await makeAuthBearerRequest(
      application.app,
      'delete',
      jwt_token,
      `/comments/invalid-id`
    ).expect(404)
  })

  it('POST -> "posts/:postId/comments": should return error if auth credentials is incorrect', async () => {
    await request(application.app).post(`/posts/${postId}/comments`).expect(401)
  })

  it('PUT -> "/comments/:id": should return error if access denied', async () => {
    // Created user
    await makeAuthBasicRequest(application.app, 'post', '/users', {
      login: 'TEST_LOGIN',
      password: USER_DATA.password,
      email: 'test@mail.ru',
    })

    const loginRes = await request(application.app).post('/auth/login').send({
      loginOrEmail: 'TEST_LOGIN',
      password: USER_DATA.password,
    })

    // Created comment
    const commentRes = await makeAuthBearerRequest(
      application.app,
      'post',
      loginRes.body.accessToken,
      `/posts/${postId}/comments`,
      {
        content: COMMENT_DATA.content,
      }
    )

    // Updated the comment with a different user
    await makeAuthBearerRequest(
      application.app,
      'put',
      jwt_token,
      `/comments/${commentRes.body.id}`,
      {
        content: COMMENT_DATA.content,
      }
    ).expect(403)
  })

  describe('Comments for posts with auth > Comments body validation', () => {
    it('POST -> "/posts/:postId/comments": should return error if passed body is incorrect', async () => {
      await makeAuthBearerRequest(
        application.app,
        'post',
        jwt_token,
        `/posts/${postId}/comments`,
        {
          invalidField: 'Invalid field',
        }
      ).expect(400)
    })

    it('PUT -> "/comments/:commentId": should return error if passed body is incorrect', async () => {
      // Created comment
      const commentRes = await makeAuthBearerRequest(
        application.app,
        'post',
        jwt_token,
        `/posts/${postId}/comments`,
        {
          content: COMMENT_DATA.content,
        }
      )

      await makeAuthBearerRequest(
        application.app,
        'put',
        jwt_token,
        `/comments/${commentRes.body.id}`,
        {
          content: 'Invalid field',
        }
      ).expect(400)
    })
  })
})

afterAll(async () => {
  await request(application.app).delete('/testing/all-data').expect(204)
  await disconnect()
  application.close()
})
