import { PgRepository } from '@/infra/repos/postgres'
import { PgUser } from '@/infra/repos/postgres/entities'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/domain/contracts/repos'

export class PgUserAccountRepository extends PgRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  async load ({ email }: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = this.getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ email })
    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }

  async saveWithFacebook ({ id, email, name, facebookId }: SaveFacebookAccountRepository.Params): Promise<SaveFacebookAccountRepository.Result> {
    const pgUserRepo = this.getRepository(PgUser)
    let resultId: string
    if (id === undefined) {
      const pgUser = await pgUserRepo.save({ email, name, facebookId })
      resultId = pgUser.id.toString()
    } else {
      resultId = id
      await pgUserRepo.update({ id: parseInt(id) }, { name, facebookId })
    }
    return { id: resultId }
  }
}
