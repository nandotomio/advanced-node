import { mock } from 'jest-mock-extended'

type Setup = (fileStorage: UploadFile) => ChangeProfilePicture
type Input = { userId: string, file: Buffer }
type ChangeProfilePicture = (input: Input) => Promise<void>

const setupChangeProfilePicture: Setup = fileStorage => async ({ userId, file }) => {
  await fileStorage.upload({ file, key: userId })
}

interface UploadFile {
  upload: (input: UploadFile.Input) => Promise<void>
}

namespace UploadFile {
  export type Input = { file: Buffer, key: string }
}

describe('ChangeProfilePicture', () => {
  it('should call Upload file with correct input', async () => {
    const file = Buffer.from('any_buffer')
    const fileStorage = mock<UploadFile>()
    const sut = setupChangeProfilePicture(fileStorage)
    await sut({ userId: 'any_user_id', file })
    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: 'any_user_id' })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})
