import axios from "axios";
import qs from "qs";
import moment from "moment";
import Cors from "cors";

import * as config from "../../appConfig";
import logger from "../logger/index";
import { constructPatronObject, constructProblemDetail } from "./formDataUtils";
import {
  AddressAPIResponseData,
  AddressAPIRequestData,
  ProblemDetail,
  FormAPISubmission,
  AddressResponse,
} from "../interfaces";
import {
  generateNewToken,
  setCsrfTokenCookie,
  validateCsrfToken,
  parseTokenFromPostRequestCookies
} from "./utils";

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
 * invalidCsrfResponse
 * If the CSRF token is invalid, return a 403 forbidden response.
 */
function invalidCsrfResponse(res) {
  return res
    .status(403)
    .json(
      constructProblemDetail(
        403,
        "invalid-csrf-token",
        "Invalid-csrf-token",
        "The form has been tampered with."
      )
    );
}

/**
 * validateAddress
 * Call the NYPL Platform API to validate an address.
 */
export async function validateAddress(req, res, appObj = app) {
  const tokenObject = appObj["tokenObject"];
  const parsedTokenFromRequestCookies = parseTokenFromPostRequestCookies(req);
  const csrfTokenValid = validateCsrfToken(req);
  if (!parsedTokenFromRequestCookies) {
    const newToken = generateNewToken();
    setCsrfTokenCookie(res, newToken);
  }
  if (!csrfTokenValid) {
    return invalidCsrfResponse(res);
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
  const csrfTokenValid = utils.validateCsrfToken(req);
  if (!csrfTokenValid) {
    return invalidCsrfResponse(res);
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
        return res.status(err.response?.status || 500).json({
          status: err.response?.status || 500,
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
    // Used for testing when we don't want to create real accounts,
    // just return a mocked account data.
    // return Promise.resolve({
    //   status: 200,
    //   type: "card-granted",
    //   link: "some-link",
    //   barcode: "12345678912345",
    //   username: "tomnook",
    //   password: "1234",
    //   temporary: false,
    //   message: "The library card will be a standard library card.",
    //   patronId: 1234567,
    //   name: "Tom Nook",
    //   ptype: 7,
    // });
    if ((patronData as ProblemDetail).status === 400) {
      logger.error("Invalid patron data");
      logger.error("Patron data", patronData);
      return Promise.reject(patronData);
    }

    logger.debug(
      `POSTing patron data with username ${
        (patronData as FormAPISubmission).username
      } to ${createPatronUrl}`
    );
    return axios
      .post(createPatronUrl, patronData, constructApiHeaders(token))
      .then((result) => {
        const fullName = `${(patronData as FormAPISubmission).firstName} ${
          (patronData as FormAPISubmission).lastName
        }`;
        return Promise.resolve({
          status: result.data.status,
          name: fullName,
          ...result.data,
        });
      })
      .catch((err) => {
        const status = err.response?.status || 500;
        let serverError = null;

        // If the response from the Patron Creator Service
        // does not include valid error details, we mark this result as
        // an internal server error.
        if (status === 401 || status === 403 || status === 500) {
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
        logger.error(
          `More details - status: ${status}, patron: ${patronData}, data: ${err.response?.data}`
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
  const csrfTokenValid = utils.validateCsrfToken(req, res);
  if (!csrfTokenValid) {
    return invalidCsrfResponse(res);
  }

  try {
    const response = await callPatronAPI(data, createPatronUrl, appObj);
    return res.json(response);
  } catch (error) {
    return res.status(error.status).json(error);
  }
}
