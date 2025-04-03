import { serialize } from "cookie";

const buildCookieHeader = (value) => {
  const { name, options } = metadata().csrfToken;
  const stringValue =
    typeof value === "object" ? "j:" + JSON.stringify(value) : String(value);
  return serialize(name, String(stringValue), options);
};

// Use secure cookies if the site uses HTTPS
// This being conditional allows cookies to work non-HTTPS development URLs
// Honour secure cookie option, which sets 'secure' and also adds '__Secure-'
// prefix, but enable them by default if the site URL is HTTPS; but not for
// non-HTTPS URLs like http://localhost which are used in development).
// For more on prefixes see:
// https://googlechrome.github.io/samples/cookie-prefixes/

const metadata = () => {
  const useSecureCookies = process.env.NODE_ENV === "production";
  const name = `${useSecureCookies ? "__Host-" : ""}nypl.csrf-token`;
  return {
    // default cookie options
    csrfToken: {
      // Default to __Host- for CSRF token for additional protection if using
      // useSecureCookies.
      // NB: The `__Host-` prefix is stricter than the `__Secure-` prefix.
      name,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
  };
};

export { metadata, buildCookieHeader };
