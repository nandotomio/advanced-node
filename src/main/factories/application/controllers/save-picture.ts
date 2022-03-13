import { SavePictureController } from '@/application/controllers'
import { makeChangeProfilePicture } from '@/main/factories/domain/usecases'

export const makeSavePictureController = (): SavePictureController => {
  return new SavePictureController(makeChangeProfilePicture())
}
