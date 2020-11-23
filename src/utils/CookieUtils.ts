import { serialize } from "cookie";

/**
 * set
 * Function to set cookies on the server side based on with minor updates:
 * https://github.com/vercel/next.js/blob/master/examples/api-routes-middleware/utils/cookies.js
 */
const set = (res, name, value, options) => {
  const stringValue =
    typeof value === "object" ? "j:" + JSON.stringify(value) : String(value);

  return res.setHeader(
    "Set-Cookie",
    serialize(name, String(stringValue), options)
  );
};

export default { set };
