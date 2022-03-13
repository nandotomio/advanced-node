import { app } from '@/main/config/app'
import { PgUser } from '@/infra/repos/postgres/entities'
import { makeFakeDb } from '@/tests/infra/repos/postgres/mocks'
import { env } from '@/main/config/env'

import { IBackup } from 'pg-mem'
import { getRepository, Repository, getConnection } from 'typeorm'
import request from 'supertest'
import { sign } from 'jsonwebtoken'

describe('User Routes', () => {
  let backup: IBackup
  let pgUserRepo: Repository<PgUser>

  beforeAll(async () => {
    const db = await makeFakeDb([PgUser])
    backup = db.backup()
    pgUserRepo = getRepository(PgUser)
  })

  afterAll(async () => {
    await getConnection().close()
  })

  beforeEach(() => {
    backup.restore()
  })

  describe('DELETE /users/picture', () => {
    it('should return 403 if no authorization header is present', async () => {
      const { statusCode } = await request(app)
        .delete('/api/users/picture')

      expect(statusCode).toBe(403)
    })

    it('should return 200 with valid data', async () => {
      const { id } = await pgUserRepo.save({ email: 'any_email', name: 'Fernando Tomio' })
      const authorization = sign({ key: id }, env.jwtSecret)

      const { statusCode, body } = await request(app)
        .delete('/api/users/picture')
        .set({ authorization })

      expect(statusCode).toBe(200)
      expect(body).toEqual({ pictureUrl: undefined, initials: 'FT' })
    })
  })

  describe('PUT /users/picture', () => {
    const uploadSpy = jest.fn()

    jest.mock('@/infra/gateways/aws-s3-file-storage', () => ({
      AwsS3FileStorage: jest.fn().mockReturnValue({ upload: uploadSpy })
    }))

    it('should return 403 if no authorization header is present', async () => {
      const { statusCode } = await request(app)
        .put('/api/users/picture')

      expect(statusCode).toBe(403)
    })

    it('should return 200 with valid data', async () => {
      uploadSpy.mockResolvedValueOnce('any_url')
      const { id } = await pgUserRepo.save({ email: 'any_email', name: 'any_name' })
      const authorization = sign({ key: id }, env.jwtSecret)

      const { statusCode, body } = await request(app)
        .put('/api/users/picture')
        .set({ authorization })
        .attach('picture', Buffer.from('any_buffer'), { filename: 'any_name', contentType: 'image/png' })

      expect(statusCode).toBe(200)
      expect(body).toEqual({ pictureUrl: 'any_url', initials: undefined })
    })
  })
})
