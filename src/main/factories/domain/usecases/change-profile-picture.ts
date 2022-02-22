import { setupChangeProfilePicture, ChangeProfilePicture } from '@/domain/usecases'
import { makeAwsS3FileStorage, makeUniqueId } from '@/main/factories/infra/gateways'
import { makePgUserProfileRepository } from '@/main/factories/infra/repos'

export const makeChangeProfilePicture = (): ChangeProfilePicture => {
  return setupChangeProfilePicture(makeAwsS3FileStorage(), makeUniqueId(), makePgUserProfileRepository())
}
