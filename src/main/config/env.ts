export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? 'fb_client_id',
    clientSecret: process.env.FB_CLIENT_SECRET ?? 'fb_client_secret'
  },
  port: process.env.PORT ?? 8080
}
