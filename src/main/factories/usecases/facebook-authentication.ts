import { FacebookAuthenticationUseCase } from '@/domain/usecases'
import { makeFacebookApi } from '@/main/factories/apis'
import { makePgUserAccountRepository } from '@/main/factories/repos'
import { makeJwtTokenGenerator } from '@/main/factories/crypto'

export const makeFacebookAuthentication = (): FacebookAuthenticationUseCase => {
  return new FacebookAuthenticationUseCase(makeFacebookApi(), makePgUserAccountRepository(), makeJwtTokenGenerator())
}
