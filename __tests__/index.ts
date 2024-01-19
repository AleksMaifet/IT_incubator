import { Application, Router } from 'express'
import request from 'supertest'

const makeAuthBasicRequest = <T>(
  app: Application,
  method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>,
  url: string,
  body?: T
) => {
  let req = request(app)
    [method](url)
    .set('authorization', 'Basic YWRtaW46cXdlcnR5')

  if (!body) {
    return req
  }

  return req.send(body)
}

const makeAuthBearerRequest = <T>(
  app: Application,
  method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>,
  jwtToken: string,
  url: string,
  body?: T
) => {
  let req = request(app)[method](url).set('authorization', `Bearer ${jwtToken}`)

  if (!body) {
    return req
  }

  return req.send(body)
}

export { makeAuthBasicRequest, makeAuthBearerRequest }
