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
  publicKey:
    '-----BEGIN PUBLIC KEY-----\n' +
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtmIMVmUnbwr/65MYmLGJ\n' +
    'm4aDXd0AmYI/Ww2yRye4LR2fmB6qrgdyiidmR1qV86kS287MzfYBYoTEYYjDQI0f\n' +
    'VLlH0es8ubifn0cM4hnwDnNJds3JYohen2OM+08qEsOCSIlsTJ2YDHNmUAMIiIRs\n' +
    'ay1efUPq98iAUAZkDr/M6ytwh+Sa9xmaeXVjJxUu0E8sCrqFuuZ7qm8A0ljlncLv\n' +
    'UCbulaUg9lKM8SPfaWu2O4Xr1YupmyIlYkWDzbqIZbpu8cv0nnNOonEOVckjwhMz\n' +
    'M7lSsQ05AXR0VAsZzafkpcC/yFp2Dfa2ZsKJNv/TDmYGDQ6wHgtU51ZEVq48jBz9\n' +
    'cQIDAQAB\n' +
    '-----END PUBLIC KEY-----',
};
