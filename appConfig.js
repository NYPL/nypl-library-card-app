export default {
  appTitle: "Library Card Application Form",
  appName: "NYPL Library Card App",
  favIconPath: "//d2znry4lg8s0tq.cloudfront.net/images/favicon.ico",
  api: {
    oauth: process.env.OAUTH_PROVIDER_URL,
    patron: process.env.PATRON_CREATION_URL,
    validate: process.env.PATRON_VALIDATION_URL,
  },
  clientId: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
  ipStackKey: process.env.IPSTACK_KEY,
  useAxe: process.env.NEXT_PUBLIC_USE_AXE,
  nodeEnv: process.env.NODE_ENV,
  agencyType: {
    default: "198",
    nys: "199",
  },
  scopes: "account:write account:read",
};
