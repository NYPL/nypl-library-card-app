import { serialize } from "cookie";

// Function to set cookies server side
//
// Credit to @huv1k and @jshttp contributors for the code which this is based on (MIT License).
// * https://github.com/jshttp/cookie/blob/master/index.js
// * https://github.com/zeit/next.js/blob/master/examples/api-routes-middleware/utils/cookies.js
//
// As only partial functionlity is required, only the code we need has been incorporated here
// (with fixes for specific issues) to keep dependancy size down.
const set = (res, name, value, options) => {
  const stringValue =
    typeof value === "object" ? "j:" + JSON.stringify(value) : String(value);

  return res.setHeader(
    "Set-Cookie",
    serialize(name, String(stringValue), options)
  );
};

/**
 * encodeURI(sKey)
 * Encode the cookie response.
 *
 * @param {string} sKey -  The name of the cookie to be looked up.
 */
function encodeURI(sKey) {
  encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&");
}

/**
 * getCookie(sKey)
 * Get a cookie based on its name.
 *
 * @param {string} sKey - The name of the cookie to be looked up.
 */
function getCookie(sKey) {
  if (!sKey) {
    return null;
  }

  return (
    decodeURIComponent(
      document.cookie.replace(
        new RegExp(
          `(?:(?:^|.*;)\\s*${encodeURI(sKey)}\\s*\\=\\s*([^;]*).*$)|^.*$`
        ),
        "$1"
      )
    ) || null
  );
}

/**
 * hasCookie(sKey)
 * See if a specific cookie.
 *
 * @param {string} sKey - The name of the cookie to be looked up.
 */
function hasCookie(sKey) {
  if (!sKey) {
    return false;
  }
  const regExp = new RegExp(`(?:^|;\\s*)${encodeURI(sKey)}\\s*\\=`);
  return regExp.test(document.cookie);
}

export default { getCookie, hasCookie, set };
