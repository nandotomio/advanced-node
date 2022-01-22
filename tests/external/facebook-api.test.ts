import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClient } from '@/infra/http'
import { env } from '@/main/config/env'

import nock from 'nock'

describe('Facebook Api Integration Tests', () => {
  const facebookBaseUrl = 'https://graph.facebook.com'
  let axiosClient: AxiosHttpClient
  let sut: FacebookApi

  beforeAll(() => {
    nock(facebookBaseUrl, { allowUnmocked: true })
      .get('/oauth/access_token')
      .query({
        client_id: 'fb_client_id',
        client_secret: 'fb_client_secret',
        grant_type: 'client_credentials'
      })
      .reply(200, {
        access_token: 'any_app_token'
      })
      .get('/debug_token')
      .query({
        access_token: 'any_app_token',
        input_token: 'any_token'
      })
      .reply(200, {
        data: {
          user_id: 'any_user_id'
        }
      })
      .get('/any_user_id')
      .query({
        fields: 'id,name,email',
        access_token: 'any_token'
      })
      .reply(200, {
        id: 'any_fb_id',
        name: 'any_fb_name',
        email: 'any_fb_email'
      }).persist()
  })

  afterAll(() => {
    nock.cleanAll()
  })

  beforeEach(() => {
    axiosClient = new AxiosHttpClient()
    sut = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret)
  })

  it('should return a Facebook User if token is valid', async () => {
    const fbUser = await sut.loadUser({ token: 'any_token' })
    expect(fbUser).toEqual({
      facebookId: 'any_fb_id',
      email: 'any_fb_email',
      name: 'any_fb_name'
    })
  })

  it('should return undefined if token is invalid', async () => {
    nock(facebookBaseUrl, { allowUnmocked: true })
      .get('/debug_token')
      .query({
        access_token: 'any_app_token',
        input_token: 'invalid'
      })
      .reply(400)
    const fbUser = await sut.loadUser({ token: 'invalid' })
    expect(fbUser).toBeUndefined()
  })
})
