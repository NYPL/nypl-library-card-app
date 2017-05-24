export default {
  appTitle: 'Library Card Application Form | NYPL',
  appName: 'NYPL Library Card App',
  favIconPath: '//d2znry4lg8s0tq.cloudfront.net/images/favicon.ico',
  port: 3001,
  webpackDevServerPort: 3000,
  api: {
    oauth: process.env.OAUTH_PROVIDER_URL,
    patron: process.env.PATRON_CREATION_URL,
    validate: process.env.PATRON_VALIDATION_URL,
  },
  clientId: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
  scopes: 'account:write account:read',
  confirmationURL:{
    base: 'https://www.nypl.org/get-help/library-card/confirmation',
  },
};
