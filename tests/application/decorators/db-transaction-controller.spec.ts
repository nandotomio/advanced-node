import { mock } from 'jest-mock-extended'

interface DbTransaction {
  openTransaction: () => Promise<void>
}

class DbTransactionController {
  constructor (private readonly db: DbTransaction) {}

  async perform (httpRequest: any): Promise<void> {
    await this.db.openTransaction()
  }
}

describe('DbTransactionController', () => {
  it('should open transaction', async () => {
    const db = mock<DbTransaction>()
    const sut = new DbTransactionController(db)

    await sut.perform({ any: 'any' })

    expect(db.openTransaction).toHaveBeenCalledWith()
    expect(db.openTransaction).toHaveBeenCalledTimes(1)
  })
})
