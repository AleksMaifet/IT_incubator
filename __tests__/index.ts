import { Application, Router } from 'express'
import request from 'supertest'

const makeAuthRequest = <T>(
  app: Application,
  method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>,
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

export { makeAuthRequest }
