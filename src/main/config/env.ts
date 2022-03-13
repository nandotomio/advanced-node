import { ConnectionOptions } from 'typeorm'

const projectRootDir = process.env.TS_NODE_DEV === undefined ? 'dist' : 'src'

const pgConnection: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? '',
  port: 5432,
  username: '',
  password: '',
  database: '',
  entities: [`${projectRootDir}/infra/repos/postgres/entities/index.{js,ts}`]
}

export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? 'fb_client_id',
    clientSecret: process.env.FB_CLIENT_SECRET ?? 'fb_client_secret',
    accessToken: process.env.FB_ACCESS_TOKEN ?? 'fb_access_token'
  },
  s3: {
    accessKey: process.env.AWS_ACCESS_KEY_ID ?? '',
    secret: process.env.AWS_SECRET_ACCESS_KEY ?? '',
    bucket: process.env.AWS_BUCKET ?? '',
    key: process.env.AWS_KEY ?? ''
  },
  port: process.env.PORT ?? 8080,
  jwtSecret: process.env.JWT_SECRET ?? '923yr312ry39',
  pgConnection
}
