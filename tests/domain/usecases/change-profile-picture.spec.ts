import { UploadFile, UUIDGenerator, DeleteFile } from '@/domain/contracts/gateways'
import { setupChangeProfilePicture, ChangeProfilePicture } from '@/domain/usecases'
import { SaveUserPicture, LoadUserProfile } from '@/domain/contracts/repos'
import { UserProfile } from '@/domain/entities'

import { mock, MockProxy } from 'jest-mock-extended'
import { mocked } from 'jest-mock'

jest.mock('@/domain/entities/user-profile')

describe('ChangeProfilePicture', () => {
  let uuid: string
  let file: Buffer
  let fileStorage: MockProxy<UploadFile & DeleteFile>
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
    expect(userProfileRepo.savePicture).toHaveBeenCalledWith(...mocked(UserProfile).mock.instances)
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

  it('should return correct data on success', async () => {
    mocked(UserProfile).mockImplementationOnce(id => ({
      setPicture: jest.fn(),
      id: 'any_user_id',
      pictureUrl: 'any_url',
      initials: 'any_initials'
    }))
    const result = await sut({ userId: 'any_user_id', file })
    expect(result).toMatchObject({
      pictureUrl: 'any_url',
      initials: 'any_initials'
    })
  })

  it('should call DeleteFile if file exists and SaveUserPicture throws', async () => {
    userProfileRepo.savePicture.mockRejectedValueOnce(new Error())
    const promise = sut({ userId: 'any_user_id', file })
    await expect(promise).rejects.toThrow()
    expect(fileStorage.delete).toHaveBeenCalledWith({ key: uuid })
    expect(fileStorage.delete).toHaveBeenCalledTimes(1)
  })

  it('should not call DeleteFile if file does not exists and SaveUserPicture throws', async () => {
    userProfileRepo.savePicture.mockRejectedValueOnce(new Error())
    const promise = sut({ userId: 'any_user_id', file: undefined })
    await expect(promise).rejects.toThrow()
    expect(fileStorage.delete).not.toHaveBeenCalled()
  })
})
