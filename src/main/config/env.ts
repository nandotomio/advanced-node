import { ConnectionOptions } from 'typeorm'

export const pgConnection: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? '',
  port: 5432,
  username: '',
  password: '',
  database: '',
  entities: ['dist/infra/postgres/entities/index.ts']
}

export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? 'fb_client_id',
    clientSecret: process.env.FB_CLIENT_SECRET ?? 'fb_client_secret'
  },
  port: process.env.PORT ?? 8080,
  jwtSecret: process.env.JWT_SECRET ?? '923yr312ry39',
  pgConnection
}
