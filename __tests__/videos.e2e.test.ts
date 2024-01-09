import request from 'supertest'
import { boot } from '../src/main'
import { App } from '../src/app'
import { MongoService } from '../src/db'
import { ConfigService, LoggerService } from '../src/services'

let application: App
const createdVideo = {
  title: 'string',
  author: 'string',
  availableResolutions: ['P144'],
}
const videoId = '00000000000000'

beforeAll(() => {
  const { app } = boot

  application = app
})

describe('Videos', () => {
  it('GET videos from clear db', async () => {
    await request(application.app).get('/videos').expect([])
  })

  it('GET video by id success', async () => {
    const res = await request(application.app)
      .post('/videos')
      .send(createdVideo)

    await request(application.app).get(`/videos/${res.body.id}`).expect(200)
  })

  it('GET video by id with error', async () => {
    await request(application.app).get(`/videos/${videoId}`).expect(404)
  })

  it('POST created video success', async () => {
    await request(application.app)
      .post('/videos')
      .send(createdVideo)
      .expect(201)
  })

  it('POST not created video with error', async () => {
    await request(application.app).post(`/videos`).expect(400)
  })

  it('PUT update video by id success', async () => {
    const res = await request(application.app)
      .post('/videos')
      .send(createdVideo)

    await request(application.app)
      .put(`/videos/${res.body.id}`)
      .send({
        title: 'string',
        author: 'string',
        availableResolutions: ['P144'],
        canBeDownloaded: true,
        minAgeRestriction: 18,
        publicationDate: '2023-01-01T00:00:00.000Z',
      })
      .expect(204)
  })

  it('PUT not update video by id with error', async () => {
    await request(application.app).put(`/videos/${videoId}`).expect(400)
  })

  it('DELETE delete video by id success', async () => {
    const res = await request(application.app)
      .post('/videos')
      .send(createdVideo)

    await request(application.app).delete(`/videos/${res.body.id}`).expect(204)
  })

  it('DELETE not delete video by id with error', async () => {
    await request(application.app).delete(`/videos/${videoId}`).expect(404)
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
