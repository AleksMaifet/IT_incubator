import { disconnect } from 'mongoose'
import request from 'supertest'
import { boot } from '../src/main'
import { App } from '../src/app'
import { makeAuthBasicRequest } from './auths'
import { DEFAULT_TEST_DATA } from './data'

const { BLOG_DATA, POST_DATA } = DEFAULT_TEST_DATA

let application: App
const errorId = '00000000000000'

beforeAll(async () => {
  const { app } = boot

  application = app

  await request(application.app).delete('/testing/all-data').expect(204)
})

describe('Blogs', () => {
  it('GET blog by id with error', async () => {
    await request(application.app)
      .get('/blogs' + `/${errorId}`)
      .expect(404)
  })

  it('GET blogs by id success', async () => {
    const res = await makeAuthBasicRequest(
      application.app,
      'post',
      '/blogs',
      BLOG_DATA
    )

    await request(application.app)
      .get('/blogs' + `/${res.body.id}`)
      .expect(200)
  })

  it('POST/PUT/DELETE  blog with Unauthorized error', async () => {
    await request(application.app).post('/blogs').expect(401)
    await request(application.app)
      .delete('/blogs' + `/${errorId}`)
      .expect(401)
    await request(application.app)
      .put('/blogs' + `/${errorId}`)
      .expect(401)
  })

  it('POST not created blog with error', async () => {
    await makeAuthBasicRequest(application.app, 'post', '/blogs').expect(400)
  })

  it('POST created blog success', async () => {
    await makeAuthBasicRequest(
      application.app,
      'post',
      '/blogs',
      BLOG_DATA
    ).expect(201)
  })

  it('PUT update blog by id success', async () => {
    const res = await makeAuthBasicRequest(
      application.app,
      'post',
      '/blogs',
      BLOG_DATA
    )
    await makeAuthBasicRequest(
      application.app,
      'put',
      '/blogs' + `/${res.body.id}`,
      BLOG_DATA
    ).expect(204)
  })

  it('PUT not update blog by id with error', async () => {
    await makeAuthBasicRequest(
      application.app,
      'put',
      '/blogs' + `/${errorId}`
    ).expect(404)
  })

  it('DELETE delete blog by id success', async () => {
    const res = await makeAuthBasicRequest(
      application.app,
      'post',
      '/blogs',
      BLOG_DATA
    )

    await makeAuthBasicRequest(
      application.app,
      'delete',
      '/blogs' + `/${res.body.id}`
    ).expect(204)
  })

  it('DELETE not delete blog by id with error', async () => {
    await makeAuthBasicRequest(
      application.app,
      'delete',
      '/blogs' + `/${errorId}`
    ).expect(404)
  })
})

describe('Posts', () => {
  it('GET posts by id with error', async () => {
    await request(application.app)
      .get('/posts' + `/${errorId}`)
      .expect(404)
  })

  it('GET posts by id success', async () => {
    const resBlog = await makeAuthBasicRequest(
      application.app,
      'post',
      '/blogs',
      BLOG_DATA
    )

    const res = await makeAuthBasicRequest(application.app, 'post', '/posts', {
      ...POST_DATA,
      blogId: resBlog.body.id,
    })

    await request(application.app)
      .get('/posts' + `/${res.body.id}`)
      .expect(200)
  })

  it('POST/PUT/DELETE  post with Unauthorized error', async () => {
    await request(application.app).post('/posts').expect(401)
    await request(application.app)
      .delete('/posts' + `/${errorId}`)
      .expect(401)
    await request(application.app)
      .put('/posts' + `/${errorId}`)
      .expect(401)
  })

  it('POST not created post with error', async () => {
    await makeAuthBasicRequest(application.app, 'post', '/posts').expect(400)
  })

  it('POST created post success', async () => {
    const resBlog = await makeAuthBasicRequest(
      application.app,
      'post',
      '/blogs',
      BLOG_DATA
    )

    await makeAuthBasicRequest(application.app, 'post', '/posts', {
      ...POST_DATA,
      blogId: resBlog.body.id,
    }).expect(201)
  })

  it('PUT update post by id success', async () => {
    const resBlog = await makeAuthBasicRequest(
      application.app,
      'post',
      '/blogs',
      BLOG_DATA
    )

    const res = await makeAuthBasicRequest(application.app, 'post', '/posts', {
      ...POST_DATA,
      blogId: resBlog.body.id,
    })
    await makeAuthBasicRequest(
      application.app,
      'put',
      '/posts' + `/${res.body.id}`,
      {
        ...POST_DATA,
        blogId: resBlog.body.id,
      }
    ).expect(204)
  })

  it('PUT not update video by id with error', async () => {
    await makeAuthBasicRequest(
      application.app,
      'put',
      '/posts' + `/${errorId}`
    ).expect(404)
  })

  it('DELETE delete video by id success', async () => {
    const resBlog = await makeAuthBasicRequest(
      application.app,
      'post',
      '/blogs',
      BLOG_DATA
    )

    const res = await makeAuthBasicRequest(application.app, 'post', '/posts', {
      ...POST_DATA,
      blogId: resBlog.body.id,
    })
    await makeAuthBasicRequest(
      application.app,
      'delete',
      '/posts' + `/${res.body.id}`
    ).expect(204)
  })

  it('DELETE not delete video by id with error', async () => {
    await makeAuthBasicRequest(
      application.app,
      'delete',
      '/posts' + `/${errorId}`
    ).expect(404)
  })
})
afterAll(async () => {
  await request(application.app).delete('/testing/all-data').expect(204)
  await disconnect()
  application.close()
})
