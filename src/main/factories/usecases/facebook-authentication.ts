import { setupFacebookAuthentication, FacebookAuthentication } from '@/domain/usecases'
import { makeFacebookApi } from '@/main/factories/apis'
import { makePgUserAccountRepository } from '@/main/factories/repos'
import { makeJwtTokenHandler } from '@/main/factories/crypto'

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  return setupFacebookAuthentication(makeFacebookApi(), makePgUserAccountRepository(), makeJwtTokenHandler())
}
