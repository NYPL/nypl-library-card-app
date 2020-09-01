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

export default {
  getCookie,
  hasCookie,
};
