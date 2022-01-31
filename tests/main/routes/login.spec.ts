import { app } from '@/main/config/app'
import { PgUser } from '@/infra/repos/postgres/entities'
import { makeFakeDb } from '@/tests/infra/repos/postgres/mocks'
import { UnauthorizedError } from '@/application/errors'

import { IBackup } from 'pg-mem'
import { getConnection } from 'typeorm'
import request from 'supertest'

describe('Login Routes', () => {
  describe('POST /login/facebook', () => {
    let backup: IBackup
    const loadUserSpy = jest.fn()

    jest.mock('@/infra/gateways/facebook-api', () => ({
      FacebookApi: jest.fn().mockReturnValue({ loadUser: loadUserSpy })
    }))

    beforeAll(async () => {
      const db = await makeFakeDb([PgUser])
      backup = db.backup()
    })

    afterAll(async () => {
      await getConnection().close()
    })

    beforeEach(() => {
      backup.restore()
    })

    it('should return 200 with AccessToken', async () => {
      loadUserSpy.mockResolvedValueOnce({
        facebookId: 'any_id',
        name: 'any_name',
        email: 'any_email'
      })
      const { statusCode, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'valid_token' })
        .expect(200)
      expect(statusCode).toBe(200)
      expect(body).toEqual(expect.objectContaining({
        accessToken: expect.any(String)
      }))
    })

    it('should return 401 with UnauthorizedError', async () => {
      const { statusCode, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'invalid_token' })
      expect(statusCode).toBe(401)
      expect(body).toEqual(expect.objectContaining({
        error: new UnauthorizedError().message
      }))
    })
  })
})
