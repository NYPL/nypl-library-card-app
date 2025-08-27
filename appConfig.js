export const appTitle = "Library Card Application Form";
export const appName = "NYPL Library Card App";
export const favIconPath = "https://ux-static.nypl.org/images/favicon.ico";
export const api = {
  oauth: process.env.OAUTH_PROVIDER_URL,
  patron: process.env.PATRON_CREATION_URL,
  validate: process.env.PATRON_VALIDATION_URL,
};
export const clientId = process.env.OAUTH_CLIENT_ID;
export const clientSecret = process.env.OAUTH_CLIENT_SECRET;
export const ipStackKey = process.env.IPSTACK_KEY;
export const nodeEnv = process.env.NODE_ENV;
export const appEnv = process.env.APP_ENV;
export const agencyType = {
  default: "198",
  nys: "199",
};
export const scopes = "account:write account:read";
export const dsHeader = process.env.NEXT_PUBLIC_DS_GLOBAL_HEADER;
export const dsFooter = process.env.NEXT_PUBLIC_DS_GLOBAL_FOOTER;
export const adobeAnalyticsTag = process.env.NEXT_PUBLIC_ADOBE_ANALYTICS_TAG;
export const cookieDomain = process.env.COOKIE_DOMAIN;
