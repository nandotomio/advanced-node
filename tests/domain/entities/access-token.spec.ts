import { AccessToken } from '@/domain/entities'

describe('AccessToken', () => {
  it('should expire in 1800000ms', () => {
    expect(AccessToken.expirationInMs).toBe(1800000)
  })
})
