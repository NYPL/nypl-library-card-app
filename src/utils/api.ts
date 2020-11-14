/* eslint-disable @typescript-eslint/camelcase */
import axios from "axios";
import qs from "qs";
import moment from "moment";
import Cors from "cors";

import { createHash, randomBytes } from "crypto";
import cookie from "./CookieUtils";

import config from "../../appConfig";
import logger from "../logger/index";
import { constructPatronObject, constructProblemDetail } from "./formDataUtils";
import {
  AddressAPIResponseData,
  AddressAPIRequestData,
  ProblemDetail,
  FormAPISubmission,
  AddressResponse,
} from "../interfaces";

// Initializing the cors middleware
export const cors = Cors({
  methods: ["GET", "HEAD", "POST"],
});

// Helper method to wait for a middleware to execute before continuing and
// to throw an error when an error happens in a middleware.
export async function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export const getCsrfToken = (req, res) => {
  let csrfToken;
  let csrfTokenValid = false;
  const csrfTokenFromPost = req.body?.csrfToken;
  // Secret used salt cookies and tokens (e.g. for CSRF protection).
  // If no secret option is specified then it creates one on the fly
  // based on options passed here. A options contains unique data, such as
  // oAuth provider secrets and database credentials it should be sufficent.
  const secret = createHash("sha256")
    // TODO: Update
    .update(JSON.stringify({ data: "some piece of data" }))
    .digest("hex");

  // Use secure cookies if the site uses HTTPS
  // This being conditional allows cookies to work non-HTTPS development URLs
  // Honour secure cookie option, which sets 'secure' and also adds '__Secure-'
  // prefix, but enable them by default if the site URL is HTTPS; but not for
  // non-HTTPS URLs like http://localhost which are used in development).
  // For more on prefixes see https://googlechrome.github.io/samples/cookie-prefixes/
  const useSecureCookies = process.env.NODE_ENV === "production";
  // const cookiePrefix = useSecureCookies ? "__Secure-" : "";

  // @TODO Review cookie settings (names, options)
  const cookies = {
    // default cookie options
    csrfToken: {
      // Default to __Host- for CSRF token for additional protection if using useSecureCookies
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
  // Used as part of the strateigy for mitigation for CSRF tokens.
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
  // let csrfToken;
  if (req.cookies[cookies.csrfToken.name]) {
    const [csrfTokenValue, csrfTokenHash] = req.cookies[
      cookies.csrfToken.name
    ].split("|");
    console.log("existin token", csrfTokenValue);
    if (
      csrfTokenHash ===
      createHash("sha256").update(`${csrfTokenValue}${secret}`).digest("hex")
    ) {
      console.log("we trust!");
      // If hash matches then we trust the CSRF token value
      csrfToken = csrfTokenValue;
      console.log("but are they equal?", csrfToken === csrfTokenFromPost);
      // If this is a POST request and the CSRF Token in the Post request matches
      // the cookie we have already verified is one we have set, then token is verified!
      if (req.method === "POST" && csrfToken === csrfTokenFromPost) {
        csrfTokenValid = true;
      }
    }
  }
  if (!csrfToken) {
    // If no csrfToken - because it's not been set yet, or because the hash doesn't match
    // (e.g. because it's been modified or because the secret has changed) create a new token.
    csrfToken = randomBytes(32).toString("hex");
    const newCsrfTokenCookie = `${csrfToken}|${createHash("sha256")
      .update(`${csrfToken}${secret}`)
      .digest("hex")}`;
    console.log("creating new token", newCsrfTokenCookie);
    cookie.set(
      res,
      cookies.csrfToken.name,
      newCsrfTokenCookie,
      cookies.csrfToken.options
    );
  }

  return { csrfToken, csrfTokenValid };
};

const authConfig = {
  client_id: config.clientId,
  client_secret: config.clientSecret,
  grant_type: "client_credentials",
};

/**
 * constructApiHeaders
 * Creates the authorization header to use when calling the NYPL Platform API.
 */
export const constructApiHeaders = (token: string) => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  timeout: 10000,
});

/**
 * isTokenExpiring
 * Returns if the auth token's expiration time is less than a certain time
 * limit, which defaults to 5 minutes.
 */
export const isTokenExpiring = (
  expirationTime,
  timeThreshold = 5,
  type = "minutes"
): boolean => expirationTime.diff(moment(), type) < timeThreshold;

// App-level cache object for API token related variables to be used in
// `initializeAppAuth` and `createPatron`.
const app = {};

/**
 * initializeAppAuth
 * This function makes an API call to the NYPL Auth API endpoint to get a valid
 * token to make requests to the NYPL Platform API. The NYPL Platform API hosts
 * all the Card Creator endpoints. This function is called for all the nextjs
 * API endpoints. If there is no access token available, one will requested
 * with an API call and stored in the `app` variable. If there is a token
 * available, but it's expiring in less than ten minutes, then make a request
 * to get a new access token.
 *
 * Note: appObj is used to make testing easier.
 */
export async function initializeAppAuth(req, res, appObj = app) {
  logger.info("initializeAppAuth");
  const tokenObject = appObj["tokenObject"];
  const tokenExpTime = appObj["tokenExpTime"];
  const minuteExpThreshold = 10;

  // There's no token object at all. This is the initial case before the first
  // API call. Let's request one and store it.
  if (!tokenObject?.access_token) {
    return axios
      .post(config.api.oauth, qs.stringify(authConfig))
      .then((response) => {
        if (response.data) {
          // Store the access token and other data. The expiration time is
          // "3600" but we use moment to convert it to a moment date object.
          app["tokenObject"] = response.data;
          app["tokenExpTime"] = moment().add(response.data.expires_in, "s");
          return;
        } else {
          logger.error("No access_token obtained from OAuth Service.");
          const errorObj = {};
          Object.assign(errorObj, {
            oauth: "No access_token obtained from OAuth Service.",
          });
          return res
            .status(400)
            .json(
              constructProblemDetail(
                400,
                "no-access-token",
                "No Access Token",
                "No access_token obtained from OAuth Service.",
                errorObj
              )
            );
        }
      })
      .catch((error) => {
        // Oh no! Return the error.
        logger.error(error);
        return res
          .status(400)
          .json(
            constructProblemDetail(
              400,
              "app-auth-failed",
              "App Auth failed",
              "Could not authenticate App with OAuth service",
              error
            )
          );
      });
  }

  // If there is an access token available but it will expire within ten
  // minutes, then request a new acces token.
  if (
    tokenObject.access_token &&
    isTokenExpiring(tokenExpTime, minuteExpThreshold)
  ) {
    logger.error("The access_token is expiring. Requesting a new access token");
    return axios
      .post(config.api.oauth, qs.stringify(authConfig))
      .then((response) => {
        if (response.data) {
          app["tokenObject"] = response.data;
          app["tokenExpTime"] = moment().add(response.data.expires_in, "s");
          return;
        } else {
          logger.error("No access_token reobtained from OAuth Service.");
          const errorObj = {};
          Object.assign(errorObj, {
            oauth: "No access_token reobtained from OAuth Service.",
          });
          return res
            .status(400)
            .json(
              constructProblemDetail(
                400,
                "no-access-token",
                "No Access token",
                "No access_token reobtained from OAuth Service.",
                errorObj
              )
            );
        }
      })
      .catch((error) => {
        logger.error(error);
        return res
          .status(400)
          .json(
            constructProblemDetail(
              400,
              "app-reauth-failed",
              "App re-auth failed",
              "Could not re-authenticate App with OAuth service",
              error
            )
          );
      });
  }
  return;
}

/**
 * axiosAddressPost
 * Makes a validated POST request to the API with the address and if it's a
 * work address. An `AddressAPIResponseData` object will be returned regardless if
 * the request was successful or not. We want to catch the error and safely
 * return it to the user. In some cases, an "error" will be multiple addresses
 * that the user has the choose from, or an error from Service Objects when
 * attempting to validate the address.
 */
export function axiosAddressPost(
  addressRequest: AddressAPIRequestData,
  token: string,
  validateUrl = `${config.api.validate}/address`
): Promise<AddressAPIResponseData> {
  return axios
    .post(validateUrl, addressRequest, constructApiHeaders(token))
    .then((result) => {
      return {
        status: result.data.status,
        success: true,
        ...result.data,
      };
    })
    .catch((err) => {
      return {
        status: err.response?.status,
        success: false,
        ...err.response?.data,
      };
    });
}

/**
 * validateAddress
 * Call the NYPL Platform API to validate an address.
 */
export async function validateAddress(req, res, appObj = app) {
  const tokenObject = appObj["tokenObject"];
  const { csrfToken, csrfTokenValid } = getCsrfToken(req, res);
  console.log("address csrfToken", csrfToken);
  console.log("address csrfTokenvalid", csrfTokenValid);
  if (!csrfTokenValid) {
    console.log("NO TOKEN IN ADDRESS");
  } else {
    console.log("success!!!!!!");
  }
  if (tokenObject && tokenObject?.access_token) {
    const token = tokenObject.access_token;
    const addressRequest: AddressAPIRequestData = {
      address: req.body.address,
      isWorkAddress: req.body.isWorkAddress,
    };

    return axiosAddressPost(addressRequest, token)
      .then((result) => {
        const response: AddressResponse = {
          address: result?.address || result.originalAddress,
          addresses: result?.addresses,
          success: result.success,
          cardType: result.cardType,
          detail: result.detail || result.message,
          reason: result.reason,
        };

        return res.status(result.status).json(response);
      })
      .catch((err) => {
        return res.status(err.response?.status || 502).json({
          ...err.response?.data,
        });
      });
  }

  // Else return a no token error
  return res
    .status(500)
    .json(
      constructProblemDetail(
        500,
        "no-access-token",
        "No Access Token",
        "The access token could not be generated."
      )
    );
}

/**
 * validateUsername
 * Call the NYPL Platform API to validate a username.
 */
export async function validateUsername(
  req,
  res,
  validateUrl = `${config.api.validate}/username`,
  appObj = app
) {
  const tokenObject = appObj["tokenObject"];
  const { csrfToken, csrfTokenValid } = getCsrfToken(req, res);
  console.log("username csrfToken", csrfToken);
  console.log("username csrfTokenvalid", csrfTokenValid);
  if (!csrfTokenValid) {
    console.log("NO TOKEN IN username");
  } else {
    console.log("success!!!!!!");
  }
  if (tokenObject && tokenObject?.access_token) {
    const token = tokenObject.access_token;
    const username = req.body.username;
    return axios
      .post(validateUrl, { username }, constructApiHeaders(token))
      .then((result) => {
        return res.json({
          status: result.data.status,
          ...result.data,
        });
      })
      .catch((err) => {
        return res.status(err.response.status).json({
          status: err.response.status,
          ...err.response?.data,
        });
      });
  }

  // Else return a no token error
  return res
    .status(500)
    .json(
      constructProblemDetail(
        500,
        "no-access-token",
        "No Access Token",
        "The access token could not be generated."
      )
    );
}

/**
 * callPatronAPI
 * Make a validated call to the NYPL Patrons API endpoint to create a patron
 * ILS account.
 */
export async function callPatronAPI(
  data,
  createPatronUrl = config.api.patron,
  appObj = app
) {
  const tokenObject = appObj["tokenObject"];
  if (tokenObject && tokenObject.access_token) {
    const token = tokenObject.access_token;
    const patronData = constructPatronObject(data);
    // Used for testing:
    // return Promise.resolve({
    //   status: 200,
    //   type: "card-granted",
    //   link: "some-link",
    //   barcode: "12345678912345",
    //   username: "tomnook",
    //   pin: "1234",
    //   temporary: false,
    //   message: "The library card will be a standard library card.",
    //   patronId: 1234567,
    //   name: "Tom Nook",
    // });
    if ((patronData as ProblemDetail).status === 400) {
      logger.error("Invalid patron data");
      return Promise.reject(patronData);
    }

    return axios
      .post(createPatronUrl, patronData, constructApiHeaders(token))
      .then((result) => {
        return Promise.resolve({
          status: result.data.status,
          name: (patronData as FormAPISubmission).name,
          ...result.data,
        });
      })
      .catch((err) => {
        const status = err.response?.status;
        let serverError = null;

        // If the response from the Patron Creator Service
        // does not include valid error details, we mark this result as
        // an internal server error.
        if (status === 401 || status === 403) {
          serverError = { type: "server" };
        }

        const restOfErrors = serverError
          ? { ...err.response?.data, ...serverError }
          : err.response?.data;

        logger.error(
          `Error calling Card Creator API: ${
            status === 403 ? "bad API call" : err.response?.data?.message
          }`
        );
        return Promise.reject({
          status,
          ...restOfErrors,
        });
      });
  }
  // Else return a "no token generated" error.
  const tokenGenerationError =
    "The access token could not be generated before calling the Card Creator API.";

  logger.error(tokenGenerationError);
  return Promise.reject(
    constructProblemDetail(
      500,
      "no-access-token",
      "No Access Token",
      tokenGenerationError
    )
  );
}

/**
 * createPatron
 * Internally, this make a call to `createPatron` and the NYPL Patrons API to
 * create a patron ILS account. This just returns that result as JSON for the
 * `/library-card/api/create-patron` endpoint.
 */
export async function createPatron(
  req,
  res,
  createPatronUrl = config.api.patron,
  appObj = app
) {
  const data = req.body;

  try {
    const response = await callPatronAPI(data, createPatronUrl, appObj);
    return res.json(response);
  } catch (error) {
    return res.status(error.status).json(error);
  }
}
