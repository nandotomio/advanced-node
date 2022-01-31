import { makeAxiosHttpClient } from '@/main/factories/gateways'
import { FacebookApi } from '@/infra/gateways'
import { env } from '@/main/config/env'

export const makeFacebookApi = (): FacebookApi => {
  return new FacebookApi(makeAxiosHttpClient(), env.facebookApi.clientId, env.facebookApi.clientSecret)
}
