import { Controller } from '@/application/controllers'

import { mock, MockProxy } from 'jest-mock-extended'

interface DbTransaction {
  openTransaction: () => Promise<void>
  closeTransaction: () => Promise<void>
  commitTransaction: () => Promise<void>
  rollbackTransaction: () => Promise<void>
}

class DbTransactionController {
  constructor (
    private readonly decoratee: Controller,
    private readonly db: DbTransaction
  ) {}

  async perform (httpRequest: any): Promise<void> {
    await this.db.openTransaction()
    try {
      await this.decoratee.perform(httpRequest)
      await this.db.commitTransaction()
    } catch {
      await this.db.rollbackTransaction()
    }
    await this.db.closeTransaction()
  }
}

describe('DbTransactionController', () => {
  let db: MockProxy<DbTransaction>
  let decoratee: MockProxy<Controller>
  let sut: DbTransactionController

  beforeAll(() => {
    db = mock()
    decoratee = mock()
  })

  beforeEach(() => {
    sut = new DbTransactionController(decoratee, db)
  })

  it('should open transaction', async () => {
    await sut.perform({ any: 'any' })

    expect(db.openTransaction).toHaveBeenCalledWith()
    expect(db.openTransaction).toHaveBeenCalledTimes(1)
  })

  it('should execute decoratee', async () => {
    await sut.perform({ any: 'any' })

    expect(decoratee.perform).toHaveBeenCalledWith({ any: 'any' })
    expect(decoratee.perform).toHaveBeenCalledTimes(1)
  })

  it('should call commitTransaction and closeTransaction on success', async () => {
    await sut.perform({ any: 'any' })

    expect(db.rollbackTransaction).not.toHaveBeenCalled()
    expect(db.commitTransaction).toHaveBeenCalledWith()
    expect(db.commitTransaction).toHaveBeenCalledTimes(1)
    expect(db.closeTransaction).toHaveBeenCalledWith()
    expect(db.closeTransaction).toHaveBeenCalledTimes(1)
  })

  it('should call rollbackTransaction and closeTransaction on failure', async () => {
    decoratee.perform.mockRejectedValueOnce(new Error('decoratee_error'))
    await sut.perform({ any: 'any' })

    expect(db.commitTransaction).not.toHaveBeenCalled()
    expect(db.rollbackTransaction).toHaveBeenCalledWith()
    expect(db.rollbackTransaction).toHaveBeenCalledTimes(1)
    expect(db.closeTransaction).toHaveBeenCalledWith()
    expect(db.closeTransaction).toHaveBeenCalledTimes(1)
  })
})
