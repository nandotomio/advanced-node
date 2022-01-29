import { app } from '@/main/config/app'
import { auth } from '@/main/middlewares'
import { env } from '@/main/config/env'
import { ForbiddenError } from '@/application/errors'

import request from 'supertest'
import { sign } from 'jsonwebtoken'

describe('Authentication Middleware', () => {
  it('should return 403 if Authorization header was not provided', async () => {
    app.get('/fake_route', auth)
    const { statusCode, body } = await request(app).get('/fake_route')
    expect(statusCode).toBe(403)
    expect(body.error).toBe(new ForbiddenError().message)
  })

  it('should return 200 if authorization header is valid', async () => {
    const authorization = sign({ key: 'any_user_id' }, env.jwtSecret)
    app.get('/fake_route', auth, (req, res) => {
      res.json(req.locals)
    })
    const { statusCode, body } = await request(app)
      .get('/fake_route')
      .set({ authorization })
    expect(statusCode).toBe(200)
    expect(body).toEqual({ userId: 'any_user_id' })
  })
})
