import isEmpty from "lodash/isEmpty";
import { createHash, randomBytes } from "crypto";
import { PageTitles } from "../interfaces";
import * as cookie from "./CookieUtils";
import * as appConfig from "../../appConfig";

const redirectIfUserHasRegistered = (hasRegistered: boolean, router) => {
  if (hasRegistered) {
    router.push("/congrats?newCard=true");
  }
};

/**
 * homePageRedirect
 * Function that should be used in `getStaticProps` or `getServerSideProps`.
 * This returns a redirect object that those functions understand.
 */
const homePageRedirect = () => ({
  redirect: {
    destination: "/new",
    permanent: false,
  },
});

/**
 * getPageTitles
 * Returns the page titles and updates the titles if the user is not in "nyc".
 */
function getPageTitles(): PageTitles {
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

const nyCounties = ["richmond", "queens", "new york", "kings", "bronx"];
const nyCities = [
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
const createQueryParams = (obj = {}) => {
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
const createNestedQueryParams = (dataAsString = {}, key) => {
  let query = "";
  if (!isEmpty(dataAsString) && key) {
    query = `&${key}=${JSON.stringify(dataAsString)}`;
  }
  return query;
};

const generateSecret = () => {
  // Secret uses salt cookies and tokens (e.g. for CSRF protection).
  const s1 = appConfig.clientSecret;
  const s2 = new Date().getDate();
  const s3 = new Date().getMonth();
  return (
    createHash("sha256")
      // salt is based on a secret variable and date variables
      .update(JSON.stringify({ s1, s2, s3 }))
      .digest("hex")
  );
};

const parseTokenFromPostRequestCookies = (req) => {
  let value, hash;
  if (req.cookies[cookie.metadata().csrfToken.name]) {
    [value, hash] = req.cookies[cookie.metadata().csrfToken.name].split("|");
  }
  return { value, hash };
};

/**
 * validateCsrfToken
 * Function to verify a csrf token based on code from `next-auth`
 * and modified for our purposes:
 * https://github.com/nextauthjs/next-auth/blob/main/src/server/index.js
 * Most comments are kept in place but some were added for clarity.
 */
const validateCsrfToken = (req) => {
  const tokenValueFromPostRequestBody = req.body?.csrfToken;
  const tokenFromRequestCookie = parseTokenFromPostRequestCookies(req);
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

  if (postRequestHashMatchesServerHash(tokenFromRequestCookie)) {
    return (
      req.method === "POST" &&
      tokenFromRequestCookie.value === tokenValueFromPostRequestBody
    );
  } else return false;
};

const postRequestHashMatchesServerHash = (tokenFromRequestCookie) => {
  return (
    tokenFromRequestCookie.hash ===
    createHash("sha256")
      .update(`${tokenFromRequestCookie.value}${generateSecret()}`)
      .digest("hex")
  );
};

const setCsrfTokenCookie = (res, csrfToken) => {
  const newCsrfTokenCookie = generateNewTokenCookie(
    csrfToken,
    generateSecret()
  );
  cookie.set(
    res,
    cookie.metadata().csrfToken.name,
    newCsrfTokenCookie,
    cookie.metadata().csrfToken.options
  );
};

const generateNewToken = () => {
  return randomBytes(32).toString("hex");
};

const generateNewTokenCookie = (csrfToken, secret) => {
  // If there is no csrfToken because it's not been set yet or because
  // the hash doesn't match (e.g. because it's been modified or because the
  // secret has changed), then create a new token and create a cookie.
  return `${csrfToken}|${createHash("sha256")
    .update(`${csrfToken}${secret}`)
    .digest("hex")}`;
};

export {
  redirectIfUserHasRegistered,
  homePageRedirect,
  nyCounties,
  nyCities,
  createQueryParams,
  createNestedQueryParams,
  generateSecret,
  validateCsrfToken,
  postRequestHashMatchesServerHash,
  setCsrfTokenCookie,
  generateNewToken,
  generateNewTokenCookie,
  getPageTitles,
  parseTokenFromPostRequestCookies,
};
