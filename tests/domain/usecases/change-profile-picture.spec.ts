import { mock, MockProxy } from 'jest-mock-extended'
import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways'
import { setupChangeProfilePicture, ChangeProfilePicture } from '@/domain/usecases'
import { SaveUserPicture, LoadUserProfile } from '@/domain/contracts/repos'

describe('ChangeProfilePicture', () => {
  let uuid: string
  let file: Buffer
  let fileStorage: MockProxy<UploadFile>
  let crypto: MockProxy<UUIDGenerator>
  let userProfileRepo: MockProxy<SaveUserPicture & LoadUserProfile>
  let sut: ChangeProfilePicture

  beforeAll(() => {
    uuid = 'any_unique_id'
    file = Buffer.from('any_buffer')
    fileStorage = mock()
    fileStorage.upload.mockResolvedValue('any_url')
    crypto = mock()
    userProfileRepo = mock()
    userProfileRepo.load.mockResolvedValue({ name: 'Fernando da Silva Tomio' })
    crypto.uuid.mockReturnValue(uuid)
  })

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto, userProfileRepo)
  })

  it('should call Upload file with correct input', async () => {
    await sut({ userId: 'any_user_id', file })
    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  it('should not call Upload file when file is undefined', async () => {
    await sut({ userId: 'any_user_id', file: undefined })
    expect(fileStorage.upload).not.toHaveBeenCalled()
  })

  it('should call SaveUserPicture with correct input', async () => {
    await sut({ userId: 'any_user_id', file })
    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: 'any_url', initials: undefined })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should call SaveUserPicture with correct input when file is undefined', async () => {
    await sut({ userId: 'any_user_id', file: undefined })
    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'FT' })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should call SaveUserPicture with correct input when file is undefined', async () => {
    userProfileRepo.load.mockResolvedValueOnce({ name: 'fernando da silva tomio' })
    await sut({ userId: 'any_user_id', file: undefined })
    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'FT' })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should call SaveUserPicture with correct input when file is undefined', async () => {
    userProfileRepo.load.mockResolvedValueOnce({ name: 'fernando' })
    await sut({ userId: 'any_user_id', file: undefined })
    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'FE' })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should call SaveUserPicture with correct input when file is undefined', async () => {
    userProfileRepo.load.mockResolvedValueOnce({ name: 'f' })
    await sut({ userId: 'any_user_id', file: undefined })
    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'F' })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should call SaveUserPicture with correct input when file is undefined', async () => {
    userProfileRepo.load.mockResolvedValueOnce({ name: undefined })
    await sut({ userId: 'any_user_id', file: undefined })
    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: undefined })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should call LoadUserPicture with correct input', async () => {
    await sut({ userId: 'any_user_id', file: undefined })
    expect(userProfileRepo.load).toHaveBeenCalledWith({ id: 'any_user_id' })
    expect(userProfileRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should not call LoadUserPicture if file exists', async () => {
    await sut({ userId: 'any_user_id', file })
    expect(userProfileRepo.load).not.toHaveBeenCalled()
  })
})
