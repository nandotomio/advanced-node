import { Controller } from '@/application/controllers'
import { HttpResponse } from '@/application/helpers'

import { mock, MockProxy } from 'jest-mock-extended'

interface DbTransaction {
  openTransaction: () => Promise<void>
  closeTransaction: () => Promise<void>
  commitTransaction: () => Promise<void>
  rollbackTransaction: () => Promise<void>
}

class DbTransactionController extends Controller {
  constructor (
    private readonly decoratee: Controller,
    private readonly db: DbTransaction
  ) {
    super()
  }

  async perform (httpRequest: any): Promise<HttpResponse> {
    await this.db.openTransaction()
    try {
      const httpResponse = await this.decoratee.perform(httpRequest)
      await this.db.commitTransaction()
      return httpResponse
    } catch (error) {
      await this.db.rollbackTransaction()
      throw error
    } finally {
      await this.db.closeTransaction()
    }
  }
}

describe('DbTransactionController', () => {
  let db: MockProxy<DbTransaction>
  let decoratee: MockProxy<Controller>
  let sut: DbTransactionController

  beforeAll(() => {
    db = mock()
    decoratee = mock()
    decoratee.perform.mockResolvedValue({ statusCode: 204, data: null })
  })

  beforeEach(() => {
    sut = new DbTransactionController(decoratee, db)
  })

  it('should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
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
    sut.perform({ any: 'any' }).catch(() => {
      expect(db.commitTransaction).not.toHaveBeenCalled()
      expect(db.rollbackTransaction).toHaveBeenCalledWith()
      expect(db.rollbackTransaction).toHaveBeenCalledTimes(1)
      expect(db.closeTransaction).toHaveBeenCalledWith()
      expect(db.closeTransaction).toHaveBeenCalledTimes(1)
    })
  })

  it('should return same result as decoratee on success', async () => {
    const httpResponse = await sut.perform({ any: 'any' })
    expect(httpResponse).toEqual({ statusCode: 204, data: null })
  })

  it('should rethrow if decoratee throws', async () => {
    const error = new Error('decoratee_error')
    decoratee.perform.mockRejectedValueOnce(error)
    const promise = sut.perform({ any: 'any' })
    await expect(promise).rejects.toThrow(error)
  })
})