import { Application, Router } from 'express'
import request from 'supertest'
import * as nodemailer from 'nodemailer'
import { NodemailerMock } from 'nodemailer-mock'
import { load } from 'cheerio'
import { boot } from '../src/main'
import { App } from '../src/app'
import { REFRESH_TOKEN_NAME } from './data'

const { mock } = nodemailer as unknown as NodemailerMock
const { app } = boot
let application: App = app

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

const getRefreshToken = (arr: string[]) => {
  return arr.reduce((acc, c) => {
    if (!c.includes(REFRESH_TOKEN_NAME)) {
      return acc
    }

    return c.split(`${REFRESH_TOKEN_NAME}=`)[1]
  }, '' as string)
}

const delay = (ttl: number) =>
  new Promise((resolve) => setTimeout(resolve, ttl))

const parsedHtmlAndGetCode = (html: string, query: string) => {
  const $ = load(html)
  const link = $('a').attr('href')
  const url = new URL(link!)
  const queryParams = new URLSearchParams(url.search)
  return queryParams.get(query)!
}

export {
  application,
  mock,
  makeAuthBasicRequest,
  makeAuthBearerRequest,
  getRefreshToken,
  delay,
  parsedHtmlAndGetCode,
}
