import * as cookie from "./CookieUtils";
import * as appConfig from "../../appConfig";
import { createHash, randomBytes } from "crypto";
import logger from "../logger";

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

// Creates a cookie like 'nypl.csrf-token' with the value 'token|hash',
// where 'token' is the CSRF token and 'hash' is a hash made of the token and
// the secret, and the two values are joined by a pipe '|'. By storing the
// value and the hash of the value (with the secret used as a salt) we can
// verify the cookie was set by the server and not by a malicous attacker.
const generateNewCookieTokenAndHash = (csrfToken) => {
  return `${csrfToken}|${createHash("sha256")
    .update(`${csrfToken}${generateSecret()}`)
    .digest("hex")}`;
};

// Parses token and hash generated by generateNewCookieTokenAndHash.
const parseTokenFromPostRequestCookies = (req) => {
  let value, hash;
  if (req.cookies?.[cookie.metadata().csrfToken.name]) {
    [value, hash] = req.cookies[cookie.metadata().csrfToken.name].split("|");
  }
  return { value, hash };
};

/**
 * validateCsrfToken
 * Function to verify a csrf token once upon a time based on code from
 * `next-auth` and modified for our purposes, now heavily refacotred:
 * https://github.com/nextauthjs/next-auth/blob/main/src/server/index.js
 *
 * For more details, see the following OWASP links:
 *  https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie
 *  https://owasp.org/www-chapter-london/assets/slides/David_Johansson-Double_Defeat_of_Double-Submit_Cookie.pdf
 */
const validateCsrfToken = (req) => {
  const tokenFromRequestBody = req.body?.csrfToken;
  const tokenFromRequestCookie = parseTokenFromPostRequestCookies(req);
  if (postRequestHashMatchesServerHash(tokenFromRequestCookie)) {
    return (
      req.method === "POST" &&
      tokenFromRequestCookie.value === tokenFromRequestBody
    );
  } else {
    logger.debug("CSRF token validation failed.");
    logger.debug(
      `Request body token: ${tokenFromRequestBody}\nRequestCookie token: ${tokenFromRequestCookie}`
    );
    return false;
  }
};

// Validate that the token value from the request cookies generates what the
// server knows to be a valid hash
const postRequestHashMatchesServerHash = (tokenFromRequestCookie) => {
  return (
    tokenFromRequestCookie.hash ===
    createHash("sha256")
      .update(`${tokenFromRequestCookie.value}${generateSecret()}`)
      .digest("hex")
  );
};

// Ensure CSRF Token cookie is set for any subsequent requests.
// Used as part of the strategy for mitigation for CSRF tokens.
const setCsrfTokenCookie = (res, csrfToken) => {
  const newCsrfTokenCookie = generateNewCookieTokenAndHash(csrfToken);
  cookie.set(res, newCsrfTokenCookie);
};

const generateNewToken = () => {
  return randomBytes(32).toString("hex");
};

export {
  generateSecret,
  validateCsrfToken,
  postRequestHashMatchesServerHash,
  setCsrfTokenCookie,
  generateNewToken,
  generateNewCookieTokenAndHash,
  parseTokenFromPostRequestCookies,
};
