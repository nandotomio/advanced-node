import { TokenGenerator } from '@/domain/contracts/crypto'

import { sign } from 'jsonwebtoken'

export class JwtTokenGenerator implements TokenGenerator {
  constructor (
    private readonly secret: string
  ) {}

  async generateToken ({ key, expirationInMs }: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expirationInSeconds = expirationInMs / 1000
    return sign({ key }, this.secret, { expiresIn: expirationInSeconds })
  }
}
