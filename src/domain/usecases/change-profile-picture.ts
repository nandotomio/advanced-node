import { UploadFile, UUIDGenerator, DeleteFile } from '@/domain/contracts/gateways'
import { SaveUserPicture, LoadUserProfile } from '@/domain/contracts/repos'
import { UserProfile } from '@/domain/entities'

type Setup = (fileStorage: UploadFile & DeleteFile, crypto: UUIDGenerator, userProfileRepo: SaveUserPicture & LoadUserProfile) => ChangeProfilePicture
type Input = { userId: string, file?: Buffer }
type Output = { pictureUrl?: string, initials?: string }
export type ChangeProfilePicture = (input: Input) => Promise<Output>

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo) => async ({ userId, file }) => {
  const data: { pictureUrl?: string, name?: string } = {}
  const key = crypto.uuid({ key: userId })
  if (file !== undefined) {
    data.pictureUrl = await fileStorage.upload({ file, key: crypto.uuid({ key: userId }) })
  } else {
    data.name = (await userProfileRepo.load({ id: userId })).name
  }
  const userProfile = new UserProfile(userId)
  userProfile.setPicture(data)
  try {
    await userProfileRepo.savePicture(userProfile)
  } catch (error) {
    if (file !== undefined) await fileStorage.delete({ key })
    throw error
  }
  return userProfile
}
