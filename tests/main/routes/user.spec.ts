import { app } from '@/main/config/app'
import { PgUser } from '@/infra/repos/postgres/entities'
import { makeFakeDb } from '@/tests/infra/repos/postgres/mocks'
import { env } from '@/main/config/env'

import { IBackup } from 'pg-mem'
import { getRepository, Repository, getConnection } from 'typeorm'
import request from 'supertest'
import { sign } from 'jsonwebtoken'

describe('User Routes', () => {
  describe('DELETE /users/picture', () => {
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

    it('should return 403 if no authorization header is present', async () => {
      const { statusCode } = await request(app)
        .delete('/api/users/picture')

      expect(statusCode).toBe(403)
    })

    it('should return 204', async () => {
      const { id } = await pgUserRepo.save({ email: 'any_email' })
      const authorization = sign({ key: id }, env.jwtSecret)

      const { statusCode, body } = await request(app)
        .delete('/api/users/picture')
        .set({ authorization })

      expect(statusCode).toBe(204)
      expect(body).toEqual({})
    })
  })
})
