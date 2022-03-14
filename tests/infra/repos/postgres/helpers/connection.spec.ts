import { PgConnection, ConnectionNotFoundError } from '@/infra/repos/postgres/helpers'

import { getConnectionManager, createConnection, getConnection } from 'typeorm'
import { mocked } from 'jest-mock'

jest.mock('typeorm', () => ({
  Entity: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  createConnection: jest.fn(),
  getConnectionManager: jest.fn(),
  getConnection: jest.fn()
}))

describe('PgConnection', () => {
  let getConnectionManagerSpy: jest.Mock
  let createQueryRunnerSpy: jest.Mock
  let createConnectionSpy: jest.Mock
  let getConnectionSpy: jest.Mock
  let hasSpy: jest.Mock
  let closeSpy: jest.Mock
  let startTransactionSpy: jest.Mock
  let releaseSpy: jest.Mock
  let commitTransactionSpy: jest.Mock
  let sut: PgConnection

  beforeAll(() => {
    hasSpy = jest.fn().mockReturnValue(true)
    closeSpy = jest.fn()
    getConnectionManagerSpy = jest.fn().mockReturnValue({ has: hasSpy })
    mocked(getConnectionManager).mockImplementation(getConnectionManagerSpy)
    startTransactionSpy = jest.fn()
    releaseSpy = jest.fn()
    commitTransactionSpy = jest.fn()
    createQueryRunnerSpy = jest.fn().mockReturnValue({
      startTransaction: startTransactionSpy,
      release: releaseSpy,
      commitTransaction: commitTransactionSpy
    })
    createConnectionSpy = jest.fn().mockResolvedValue({
      createQueryRunner: createQueryRunnerSpy
    })
    mocked(createConnection).mockImplementation(createConnectionSpy)
    getConnectionSpy = jest.fn().mockReturnValue({
      createQueryRunner: createQueryRunnerSpy,
      close: closeSpy
    })
    mocked(getConnection).mockImplementation(getConnectionSpy)
  })

  beforeEach(() => {
    sut = PgConnection.getInstance()
  })

  it('should have only one instance', () => {
    const sut2 = PgConnection.getInstance()
    expect(sut).toBe(sut2)
  })

  it('should create a new connection', async () => {
    hasSpy.mockReturnValueOnce(false)
    await sut.connect()
    expect(createConnectionSpy).toHaveBeenCalledWith()
    expect(createConnectionSpy).toHaveBeenCalledTimes(1)
    expect(createQueryRunnerSpy).toHaveBeenCalledWith()
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1)
  })

  it('should use an existing connection', async () => {
    await sut.connect()
    expect(getConnectionSpy).toHaveBeenCalledWith()
    expect(getConnectionSpy).toHaveBeenCalledTimes(1)
    expect(createQueryRunnerSpy).toHaveBeenCalledWith()
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1)
  })

  it('should close connection', async () => {
    await sut.connect()
    await sut.disconnect()
    expect(closeSpy).toHaveBeenCalledWith()
    expect(closeSpy).toHaveBeenCalledTimes(1)
  })

  it('should return ConnectionNotFoundError on disconnect if connection not found', async () => {
    const promise = sut.disconnect()
    expect(closeSpy).not.toHaveBeenCalled()
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError())
  })

  it('should open transaction', async () => {
    await sut.connect()
    await sut.openTransaction()

    expect(startTransactionSpy).toHaveBeenCalledWith()
    expect(startTransactionSpy).toHaveBeenCalledTimes(1)
    await sut.disconnect()
  })

  it('should return ConnectionNotFoundError on openTransaction if connection not found', async () => {
    const promise = sut.openTransaction()
    expect(startTransactionSpy).not.toHaveBeenCalled()
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError())
  })

  it('should close transaction', async () => {
    await sut.connect()
    await sut.closeTransaction()

    expect(releaseSpy).toHaveBeenCalledWith()
    expect(releaseSpy).toHaveBeenCalledTimes(1)
    await sut.disconnect()
  })

  it('should return ConnectionNotFoundError on closeTransaction if connection not found', async () => {
    const promise = sut.closeTransaction()
    expect(releaseSpy).not.toHaveBeenCalled()
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError())
  })

  it('should commit transaction', async () => {
    await sut.connect()
    await sut.commitTransaction()

    expect(commitTransactionSpy).toHaveBeenCalledWith()
    expect(commitTransactionSpy).toHaveBeenCalledTimes(1)
    await sut.disconnect()
  })

  it('should return ConnectionNotFoundError on commitTransaction if connection not found', async () => {
    const promise = sut.commitTransaction()
    expect(commitTransactionSpy).not.toHaveBeenCalled()
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError())
  })
})
