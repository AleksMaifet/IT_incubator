import { Application } from 'express'
import request from 'supertest'
import { boot } from '../src/main'
import { App } from '../src/app'
import { BasePostDto } from '../src/posts'
import { BaseBlogDto } from '../src/blogs'
import { MongoService } from '../src/db'
import { ConfigService, LoggerService } from '../src/services'

let application: App
const errorId = '00000000000000'
const updateCreatePost: BasePostDto = {
  title: 'string',
  content: 'string',
  shortDescription: 'string',
  blogId: 'string',
}
const updateCreateBlog: BaseBlogDto = {
  name: 'string',
  description: 'string',
  websiteUrl: 'https://google.com',
}

const makeAuthRequest = <T>(
  app: Application,
  method: 'post' | 'put' | 'delete',
  url: string,
  body?: T
) => {
  let req = request(app)
    [method](url)
    .set('authorization', 'Basic YWRtaW46cXdlcnR5')

  if (body) {
    req = req.send(body)
  }

  return req
}

beforeAll(async () => {
  const { app } = boot

  application = app

  await request(application.app).delete('/testing/all-data').expect(204)
})

describe('Blogs', () => {
  it('GET blogs after clear db', async () => {
    await request(application.app).get('/blogs').expect([])
  })

  it('GET blog by id with error', async () => {
    await request(application.app)
      .get('/blogs' + `/${errorId}`)
      .expect(404)
  })

  it('GET blogs by id success', async () => {
    const res = await makeAuthRequest(
      application.app,
      'post',
      '/blogs',
      updateCreateBlog
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
    await makeAuthRequest(application.app, 'post', '/blogs').expect(400)
  })

  it('POST created blog success', async () => {
    await makeAuthRequest(
      application.app,
      'post',
      '/blogs',
      updateCreateBlog
    ).expect(201)
  })

  it('PUT update blog by id success', async () => {
    const res = await makeAuthRequest(
      application.app,
      'post',
      '/blogs',
      updateCreateBlog
    )
    await makeAuthRequest(
      application.app,
      'put',
      '/blogs' + `/${res.body.id}`,
      updateCreateBlog
    ).expect(204)
  })

  it('PUT not update blog by id with error', async () => {
    await makeAuthRequest(
      application.app,
      'put',
      '/blogs' + `/${errorId}`
    ).expect(400)
  })

  it('DELETE delete blog by id success', async () => {
    const res = await makeAuthRequest(
      application.app,
      'post',
      '/blogs',
      updateCreateBlog
    )

    await makeAuthRequest(
      application.app,
      'delete',
      '/blogs' + `/${res.body.id}`
    ).expect(204)
  })

  it('DELETE not delete blog by id with error', async () => {
    await makeAuthRequest(
      application.app,
      'delete',
      '/blogs' + `/${errorId}`
    ).expect(404)
  })
})

describe('Posts', () => {
  it('GET posts after clear db', async () => {
    await request(application.app).get('/posts').expect([])
  })

  it('GET posts by id with error', async () => {
    await request(application.app)
      .get('/posts' + `/${errorId}`)
      .expect(404)
  })

  it('GET posts by id success', async () => {
    const resBlog = await makeAuthRequest(
      application.app,
      'post',
      '/blogs',
      updateCreateBlog
    )

    const res = await makeAuthRequest(application.app, 'post', '/posts', {
      ...updateCreatePost,
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
    await makeAuthRequest(application.app, 'post', '/posts').expect(400)
  })

  it('POST created post success', async () => {
    const resBlog = await makeAuthRequest(
      application.app,
      'post',
      '/blogs',
      updateCreateBlog
    )

    await makeAuthRequest(application.app, 'post', '/posts', {
      ...updateCreatePost,
      blogId: resBlog.body.id,
    }).expect(201)
  })

  it('PUT update post by id success', async () => {
    const resBlog = await makeAuthRequest(
      application.app,
      'post',
      '/blogs',
      updateCreateBlog
    )

    const res = await makeAuthRequest(application.app, 'post', '/posts', {
      ...updateCreatePost,
      blogId: resBlog.body.id,
    })
    await makeAuthRequest(
      application.app,
      'put',
      '/posts' + `/${res.body.id}`,
      {
        ...updateCreatePost,
        blogId: resBlog.body.id,
      }
    ).expect(204)
  })

  it('PUT not update video by id with error', async () => {
    await makeAuthRequest(
      application.app,
      'put',
      '/posts' + `/${errorId}`
    ).expect(400)
  })

  it('DELETE delete video by id success', async () => {
    const resBlog = await makeAuthRequest(
      application.app,
      'post',
      '/blogs',
      updateCreateBlog
    )

    const res = await makeAuthRequest(application.app, 'post', '/posts', {
      ...updateCreatePost,
      blogId: resBlog.body.id,
    })
    await makeAuthRequest(
      application.app,
      'delete',
      '/posts' + `/${res.body.id}`
    ).expect(204)
  })

  it('DELETE not delete video by id with error', async () => {
    await makeAuthRequest(
      application.app,
      'delete',
      '/posts' + `/${errorId}`
    ).expect(404)
  })
})
afterAll(async () => {
  await request(application.app).delete('/testing/all-data').expect(204)
  await new MongoService(
    new ConfigService(new LoggerService()),
    new LoggerService()
  ).disconnect()
  application.close()
})
