import { ConnectionOptions } from 'typeorm'

export const config: ConnectionOptions = {
  type: 'postgres',
  host: '',
  port: 5432,
  username: '',
  password: '',
  database: '',
  entities: ['dist/infra/postgres/entities/index.ts']
}
