export default {
  appTitle: 'Library Card Application Form | NYPL',
  appName: 'NYPL Library Card App',
  favIconPath: '//www.nypl.org/images/favicon.ico',
  port: 3001,
  webpackDevServerPort: 3000,
  api: {
    oauth: process.env.OAUTH_PROVIDER_URL,
    patron: process.env.PATRON_CREATION_URL,
    validate: process.env.PATRON_VALIDATION_URL,
  },
  clientId: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
  agencyType: {
    default: '198',
    nys: '199',
  },
  scopes: 'account:write account:read',
  confirmationURL: {
    base: process.env.CONFIRMATION_URL || 'https://www.nypl.org/get-help/library-card/confirmation',
  },
};
