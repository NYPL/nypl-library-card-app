export default {
  appTitle: 'NYPL | Get a library card (Alpha)',
  appName: 'NYPL Library Card App',
  favIconPath: '//d2znry4lg8s0tq.cloudfront.net/images/favicon.ico',
  port: 3001,
  webpackDevServerPort: 3000,
  api: {
    oauth: 'https://isso.nypl.org/oauth/token',
    patron: 'https://api.nypltech.org/api/v0.1/patrons',
    validate: 'https://api.nypltech.org/api/v0.1/validations',
  },
  clientId: 'acct_creator',
  clientSecret: '0d6fe25f918eb413042eaa5ca2641efc63b09f16',
  scopes: 'account:write account:read',
};
