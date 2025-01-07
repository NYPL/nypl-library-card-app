import isEmpty from "lodash/isEmpty";
import { createHash, randomBytes } from "crypto";
import { PageTitles } from "../interfaces";
import cookie from "./CookieUtils";
import appConfig from "../../appConfig";

export const redirectIfUserHasRegistered = (hasRegistered: boolean, router) => {
  if (hasRegistered) {
    router.push("/congrats?newCard=true");
  }
};

/**
 * homePageRedirect
 * Function that should be used in `getStaticProps` or `getServerSideProps`.
 * This returns a redirect object that those functions understand.
 */
export const homePageRedirect = () => ({
  redirect: {
    destination: "/new",
    permanent: false,
  },
});

/**
 * getPageTitles
 * Returns the page titles and updates the titles if the user is not in "nyc".
 */
export function getPageTitles(): PageTitles {
  // The "nyc" case is the only case when we don't need the work address from
  // users so we don't show it. The work address is needed for the empty,
  // "nys", and "us" cases. Now an extra page is added to the
  // form submission flow.
  return {
    personal: "Step 1 of 5: Personal Information",
    address: "Step 2 of 5: Address",
    workAddress: "Alternate Address",
    verification: "Step 3 of 5: Address Verification",
    account: "Step 4 of 5: Customize Your Account",
    review: "Step 5 of 5: Confirm Your Information",
  };
}

export const nyCounties = ["richmond", "queens", "new york", "kings", "bronx"];
export const nyCities = [
  "new york",
  "new york city",
  "nyc",
  "bronx",
  "queens",
  "brooklyn",
  "staten island",
];

/**
 * createQueryParams
 * Converts an object into key/value pairs to be use as url query params.
 */
export const createQueryParams = (obj = {}) => {
  let query = "";
  for (const [key, value] of Object.entries(obj)) {
    query += `&${key}=${value}`;
  }
  return query;
};

/**
 * createNestedQueryParams
 * Stringifies an object to be used as the value for a specified key in a url
 * query param string. This makes it easier to group together errors and
 * results and doesn't override any existing url queries if the same key name
 * appears more than once.
 */
export const createNestedQueryParams = (dataAsString = {}, key) => {
  let query = "";
  if (!isEmpty(dataAsString) && key) {
    query = `&${key}=${JSON.stringify(dataAsString)}`;
  }
  return query;
};

/**
 * getCsrfToken
 * Function to generate or verify a csrf token based on code from `next-auth`
 * and modified for our purposes:
 * https://github.com/nextauthjs/next-auth/blob/main/src/server/index.js
 * Most comments are kept in place but some were added for clarity.
 */
export const getCsrfToken = (req, res) => {
  let csrfToken;
  let csrfTokenValid = false;
  const csrfTokenFromPost = req.body?.csrfToken;
  // Secret uses salt cookies and tokens (e.g. for CSRF protection).
  const s1 = appConfig.clientSecret;
  const s2 = new Date().getDate();
  const s3 = new Date().getMonth();
  const secret = createHash("sha256")
    // salt is based on a secret variable and date variables
    .update(JSON.stringify({ s1, s2, s3 }))
    .digest("hex");

  // Use secure cookies if the site uses HTTPS
  // This being conditional allows cookies to work non-HTTPS development URLs
  // Honour secure cookie option, which sets 'secure' and also adds '__Secure-'
  // prefix, but enable them by default if the site URL is HTTPS; but not for
  // non-HTTPS URLs like http://localhost which are used in development).
  // For more on prefixes see:
  // https://googlechrome.github.io/samples/cookie-prefixes/
  const useSecureCookies = process.env.NODE_ENV === "production";

  const cookies = {
    // default cookie options
    csrfToken: {
      // Default to __Host- for CSRF token for additional protection if using
      // useSecureCookies.
      // NB: The `__Host-` prefix is stricter than the `__Secure-` prefix.
      name: `${useSecureCookies ? "__Host-" : ""}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
  };

  // Ensure CSRF Token cookie is set for any subsequent requests.
  // Used as part of the strategy for mitigation for CSRF tokens.
  //
  // Creates a cookie like 'next-auth.csrf-token' with the value 'token|hash',
  // where 'token' is the CSRF token and 'hash' is a hash made of the token and
  // the secret, and the two values are joined by a pipe '|'. By storing the
  // value and the hash of the value (with the secret used as a salt) we can
  // verify the cookie was set by the server and not by a malicous attacker.
  //
  // For more details, see the following OWASP links:
  // https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie
  // https://owasp.org/www-chapter-london/assets/slides/David_Johansson-Double_Defeat_of_Double-Submit_Cookie.pdf
  if (req.cookies[cookies.csrfToken.name]) {
    const [csrfTokenValue, csrfTokenHash] = req.cookies[
      cookies.csrfToken.name
    ].split("|");
    if (
      csrfTokenHash ===
      createHash("sha256").update(`${csrfTokenValue}${secret}`).digest("hex")
    ) {
      // If hash matches then we trust the CSRF token value
      csrfToken = csrfTokenValue;
      // If this is a POST request and the CSRF Token in the Post request
      // matches the cookie we have already verified is one we have set,
      // then token is verified!
      if (req.method === "POST" && csrfToken === csrfTokenFromPost) {
        csrfTokenValid = true;
      }
    }
  }
  if (!csrfToken) {
    // If there is no csrfToken because it's not been set yet or because
    // the hash doesn't match (e.g. because it's been modified or because the
    // secret has changed), then create a new token and create a cookie.
    csrfToken = randomBytes(32).toString("hex");
    const newCsrfTokenCookie = `${csrfToken}|${createHash("sha256")
      .update(`${csrfToken}${secret}`)
      .digest("hex")}`;
    cookie.set(
      res,
      cookies.csrfToken.name,
      newCsrfTokenCookie,
      cookies.csrfToken.options
    );
  }

  return { csrfToken, csrfTokenValid };
};

// Used for mocking in tests.
export default { getCsrfToken };
