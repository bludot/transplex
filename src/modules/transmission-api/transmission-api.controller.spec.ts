import * as request from 'supertest'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { TransmissionAPIModule } from './transmission-api.module'

describe('AuthApi', () => {
  let app: INestApplication
  // let catsService = { findAll: () => ['test'] };
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TransmissionAPIModule],
    }).compile()

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    await app.init()
  })
  describe('/hello', () => {
    it('should return "Hello World!"', async () => {
      const resp = await request(app.getHttpServer()).get('/hello').expect(200)
      expect(resp.text).toEqual('Hello World!')
    })
  })
  afterAll(async () => {
    await app.close()
  })
})
