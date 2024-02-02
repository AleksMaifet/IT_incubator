import request from 'supertest'
import { disconnect } from 'mongoose'
import {
  application,
  getRefreshToken,
  makeAuthBasicRequest,
  makeAuthBearerRequest,
} from './helpers'
import { DEFAULT_TEST_DATA } from './data'

const { USER_DATA, BLOG_DATA, POST_DATA, COMMENT_DATA } = DEFAULT_TEST_DATA

let refreshToken: string
let accessToken: string
let commentId: string
let postId: string
const users: string[] = []

beforeAll(async () => {
  await request(application.app).delete('/testing/all-data').expect(204)
})

describe('Homework 11 > Comment likes', () => {
  it('POST -> "/users": should create new user; status 201; content: created user; used additional methods: GET => /users', async () => {
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

  it('POST -> "/auth/login": should sign in user; status 200; content: JWT "access" token, JWT "refresh" token in cookie (http only, secure)', async () => {
    const response = await request(application.app).post('/auth/login').send({
      loginOrEmail: USER_DATA.email,
      password: USER_DATA.password,
    })

    accessToken = response.body.accessToken
    refreshToken = getRefreshToken(response.get('Set-Cookie'))

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('accessToken')
    expect(refreshToken).toBeTruthy()
    expect(refreshToken.includes('HttpOnly')).toBeTruthy()
    expect(refreshToken.includes('Secure')).toBeTruthy()
  })

  it(
    'POST -> "/posts/:postId/comments": should create new comment; status 201; content: ' +
      'created comment; used additional methods: POST -> /blogs, POST -> /posts, GET -> /comments/:commentId',
    async () => {
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

      postId = postRes.body.id

      const response = await makeAuthBearerRequest(
        application.app,
        'post',
        accessToken,
        `/posts/${postId}/comments`,
        {
          content: COMMENT_DATA.content,
        }
      )

      commentId = response.body.id

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('id')
    }
  )

  it(
    'GET -> "/comments/:commentsId": should return status 200; content: comment by id; ' +
      'used additional methods: POST -> /blogs, POST -> /posts, POST -> /posts/:postId/comments',
    async () => {
      await makeAuthBearerRequest(
        application.app,
        'get',
        accessToken,
        `/comments/${commentId}`
      ).expect(200)
    }
  )

  it(
    'PUT -> "/comments/:commentId/like-status": should return error if auth credentials is incorrect;' +
      ' status 401; used additional methods: POST -> /blogs, POST -> /posts, POST -> /comments',
    async () => {
      await request(application.app)
        .put(`/comments/${commentId}/like-status`)
        .send({
          likeStatus: 'Like',
        })
        .expect(401)
    }
  )

  it(
    'PUT -> "/comments/:commentId/like-status": should return error if :id from uri param not found; ' +
      'status 404',
    async () => {
      await makeAuthBearerRequest(
        application.app,
        'put',
        accessToken,
        `/comments/${commentId}id/like-status`,
        {
          likeStatus: 'Like',
        }
      ).expect(404)
    }
  )

  it(
    'GET -> "/comments/:commentId": get comment by unauthorized user. Should return liked comment with ' +
      '"myStatus: None"; status 204; ' +
      'used additional methods: POST => /blogs, POST => /posts, POST => /posts/:postId/comments, ' +
      'PUT => /comments/:commentId/like-status',
    async () => {
      const response = await request(application.app).get(
        `/comments/${commentId}`
      )

      expect(response.status).toBe(200)
      expect(response.body.likesInfo.myStatus).toBe('None')
    }
  )

  it(
    'POST -> "/users", "/auth/login": should create and login 4 users; status 201; content: ' +
      'created users',
    async () => {
      for (let i = 0; i < 4; i++) {
        const password = `${USER_DATA.password + i}`
        const login = `${USER_DATA.login + i}`

        await makeAuthBasicRequest(application.app, 'post', '/users', {
          login,
          password,
          email: `${i + USER_DATA.email}`,
        }).expect(201)

        const response = await request(application.app)
          .post('/auth/login')
          .send({
            loginOrEmail: login,
            password,
          })
          .expect(200)

        users[i] = response.body.accessToken
      }
    }
  )

  it(
    'PUT -> "/comments/:commentId/like-status": create comment then: like the comment by user 1, ' +
      'user 2, user 3, user 4. get the comment after each like by user 1. ; status 204; used additional ' +
      'methods: POST => /blogs, POST => /posts, POST => /posts/:postId/comments, GET => /comments/:id',
    async () => {
      for (let i = 0; i < 4; i++) {
        await makeAuthBearerRequest(
          application.app,
          'put',
          users[i],
          `/comments/${commentId}/like-status`,
          {
            likeStatus: 'Like',
          }
        ).expect(204)
      }

      const response = await makeAuthBearerRequest(
        application.app,
        'get',
        users[0],
        `/comments/${commentId}`
      )

      expect(response.status).toBe(200)
      expect(response.body.likesInfo.likesCount).toBe(4)
      expect(response.body.likesInfo.dislikesCount).toBe(0)
      expect(response.body.likesInfo.myStatus).toBe('Like')
    }
  )

  it(
    'PUT -> "/comments/:commentId/like-status": create comment then: dislike the comment by user 1, ' +
      'user 2; like the comment by user 3; get the comment after each like by user 1; status 204; ' +
      'used additional methods: POST => /blogs, POST => /posts, POST => /posts/:postId/comments, ' +
      'GET => /comments/:id',
    async () => {
      const stash = ['Dislike', 'Dislike', 'Like']
      const resPostComment = await makeAuthBearerRequest(
        application.app,
        'post',
        accessToken,
        `/posts/${postId}/comments`,
        {
          content: COMMENT_DATA.content,
        }
      ).expect(201)

      commentId = resPostComment.body.id

      for (let i = 0; i < 3; i++) {
        await makeAuthBearerRequest(
          application.app,
          'put',
          users[i],
          `/comments/${commentId}/like-status`,
          {
            likeStatus: stash[i],
          }
        ).expect(204)
      }

      const resGetComment = await makeAuthBearerRequest(
        application.app,
        'get',
        users[0],
        `/comments/${commentId}`
      )

      // TODO expect - 2 dis / 1 like

      expect(resGetComment.status).toBe(200)
    }
  )

  it(
    'PUT -> "/comments/:commentId/like-status": create comment then: like the comment twice by user 1;' +
      " get the comment after each like by user 1. Should increase like's count once; status 204; " +
      'used additional methods: POST => /blogs, POST => /posts, POST => /posts/:postId/comments, ' +
      'GET => /comments/:id',
    async () => {
      const resPostComment = await makeAuthBearerRequest(
        application.app,
        'post',
        accessToken,
        `/posts/${postId}/comments`,
        {
          content: COMMENT_DATA.content,
        }
      ).expect(201)

      commentId = resPostComment.body.id

      for (let i = 0; i < 2; i++) {
        await makeAuthBearerRequest(
          application.app,
          'put',
          users[0],
          `/comments/${commentId}/like-status`,
          {
            likeStatus: 'Like',
          }
        ).expect(204)
      }

      const resGetComment = await makeAuthBearerRequest(
        application.app,
        'get',
        users[0],
        `/comments/${commentId}`
      )

      expect(resGetComment.status).toBe(200)
      expect(resGetComment.body.likesInfo.likesCount).toBe(1)
    }
  )

  it(
    'PUT -> "/comments/:commentId/like-status": create comment then: like the comment by user 1; ' +
      'dislike the comment by user 1; set "none" status by user 1; get the comment after each like by user 1; ' +
      'status 204; used additional methods: POST => /blogs, POST => /posts, POST => /posts/:postId/comments, ' +
      'GET => /comments/:id',
    async () => {
      const stash = ['Like', 'Dislike', 'None']

      const resPostComment = await makeAuthBearerRequest(
        application.app,
        'post',
        accessToken,
        `/posts/${postId}/comments`,
        {
          content: COMMENT_DATA.content,
        }
      ).expect(201)

      commentId = resPostComment.body.id

      for (let i = 0; i < 3; i++) {
        await makeAuthBearerRequest(
          application.app,
          'put',
          users[0],
          `/comments/${commentId}/like-status`,
          {
            likeStatus: stash[i],
          }
        ).expect(204)
      }

      const resGetComment = await makeAuthBearerRequest(
        application.app,
        'get',
        users[0],
        `/comments/${commentId}`
      )

      // TODO expect - 0 dis / 0 like / myStatus None

      expect(resGetComment.status).toBe(200)
    }
  )

  it(
    'PUT -> "/comments/:commentId/like-status": create comment then: like the comment by user 1 ' +
      'then get by user 2; dislike the comment by user 2 then get by the user 1; status 204; ' +
      'used additional methods: POST => /blogs, POST => /posts, POST => /posts/:postId/comments, ' +
      'GET => /comments/:id',
    async () => {
      const stash = ['Like', 'Dislike']
      const resPostComment = await makeAuthBearerRequest(
        application.app,
        'post',
        accessToken,
        `/posts/${postId}/comments`,
        {
          content: COMMENT_DATA.content,
        }
      ).expect(201)

      commentId = resPostComment.body.id

      for (let i = 0; i < 2; i++) {
        await makeAuthBearerRequest(
          application.app,
          'put',
          users[i],
          `/comments/${commentId}/like-status`,
          {
            likeStatus: stash[i],
          }
        ).expect(204)
      }

      const resGetComment = await makeAuthBearerRequest(
        application.app,
        'get',
        users[0],
        `/comments/${commentId}`
      )

      // TODO expect - 1 dis / 1 like

      expect(resGetComment.status).toBe(200)
    }
  )

  // it(
  //   'GET -> "/posts/:postId/comments": create 6 comments then: like comment 1 by user 1, user 2; ' +
  //     'like comment 2 by user 2, user 3; dislike comment 3 by user 1; like comment 4 by user 1, user 4, ' +
  //     'user 2, user 3; like comment 5 by user 2, dislike by user 3; like comment 6 by user 1, dislike ' +
  //     'by user 2. Get the comments by user 1 after all likes; status 200; content: comments array for post ' +
  //     'with pagination; used additional methods: POST => /blogs, POST => ' +
  //     '/posts, POST => /posts/:postId/comments, PUT => /posts/:postId/like-status',
  //   async () => {
  //     // Test code here
  //   }
  // )
})

afterAll(async () => {
  await request(application.app).delete('/testing/all-data').expect(204)
  await disconnect()
  application.close()
})
