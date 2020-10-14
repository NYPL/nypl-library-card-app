/* eslint-disable @typescript-eslint/camelcase */
import axios from "axios";
import qs from "qs";
import moment from "moment";
import Cors from "cors";

import config from "../../appConfig";
import logger from "../logger/index";
import {
  Address,
  Addresses,
  AddressRequestData,
  AddressAPIResponseData,
  AddressResponse,
  AddressRenderType,
  ProblemDetail,
  FormAPISubmission,
} from "../interfaces";
import {
  constructAddresses,
  constructPatronObject,
  constructProblemDetail,
} from "./formDataUtils";

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
  address: Address,
  isWorkAddress: boolean,
  token: string,
  validateUrl = `${config.api.validate}/address`
): Promise<AddressAPIResponseData> {
  return axios
    .post(validateUrl, { address, isWorkAddress }, constructApiHeaders(token))
    .then((result) => {
      return {
        status: result.data.status,
        success: true,
        isWorkAddress,
        ...result.data,
      };
    })
    .catch((err) => {
      return {
        status: err.response?.status,
        success: false,
        isWorkAddress,
        ...err.response?.data,
      };
    });
}

/**
 * makeAddressAPICalls
 * A wrapper function around `Promise.all` to make one or two asychronous requests
 * to the API to validate a home address and an optional work address. Each
 * POST request is handled separately because `Promise.all` either succeeds or
 * fails. If one request succeeds but one request fails, the overall request
 * fails. To safely catch requests and return the overall data even if one
 * request fails, each request is handled by `axiosAddressPost`.
 */
export function makeAddressAPICalls(
  addresses: AddressRequestData[],
  token: string
): Promise<AddressAPIResponseData[]> {
  return Promise.all(
    addresses.map((a) => axiosAddressPost(a.address, a.isWorkAddress, token))
  );
}

/**
 * validateAddress
 * Call the NYPL Platform API to validate an address.
 */
export async function validateAddress(req, res, appObj = app) {
  const tokenObject = appObj["tokenObject"];
  if (tokenObject && tokenObject?.access_token) {
    const token = tokenObject.access_token;
    const reqAddresses: Addresses = constructAddresses(req.body.formData);
    const addressesData = [
      { address: reqAddresses.home, isWorkAddress: false },
    ];

    if (reqAddresses.work?.line1) {
      addressesData.push({ address: reqAddresses.work, isWorkAddress: true });
    }

    return makeAddressAPICalls(addressesData, token)
      .then((results: AddressAPIResponseData[]) => {
        const response: AddressResponse = {
          home: {} as AddressRenderType,
          work: {} as AddressRenderType,
        };
        const homeData = results[0];
        const workData = results[1];
        response.home = {
          address: homeData?.address || homeData.originalAddress,
          addresses: homeData?.addresses,
          detail: homeData.detail,
          reason: homeData.reason,
        };
        if (workData) {
          response.work = {
            address: workData?.address || workData?.originalAddress,
            addresses: workData?.addresses,
            detail: workData?.detail,
            reason: workData?.reason,
          };
        }
        return res.status(homeData.status).json({
          status: homeData.status,
          ...response,
        });
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

export async function createPatron(
  req,
  res,
  createPatronUrl = config.api.patron,
  appObj = app
) {
  const tokenObject = appObj["tokenObject"];
  if (tokenObject && tokenObject.access_token) {
    const token = tokenObject.access_token;
    const patronData = constructPatronObject(req.body);
    if ((patronData as ProblemDetail).status === 400) {
      logger.error("Invalid patron data");
      return res.status(400).json(patronData);
    }

    // Just for testing purposes locally. Used to verify refs and focus are
    // properly working but also to update the server response interface/type
    // later on.
    // return res.status(400).json({
    //   status: 400,
    //   response: {
    //     type: "invalid-request",
    //     title: "Invalid Request",
    //     detail: "There were errors in the submission.",
    //     error: {
    //       firstName: "First Name field is empty.",
    //       lastName: "Last Name field is empty.",
    //       birthdate: "Date of Birth field is empty.",
    //       line1: "Street Address field is empty.",
    //       city: "City field is empty.",
    //       state: "State field is empty.",
    //       zip: "Postal Code field is empty.",
    //       username: "Username field is empty.",
    //       pin: "PIN field is empty.",
    //     },
    //   },
    // });
    // Uncomment to test routing to a confirmation page with test data.
    // return res.status(200).json({
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

    return axios
      .post(createPatronUrl, patronData, constructApiHeaders(token))
      .then((result) => {
        return res.json({
          status: result.data.status,
          name: (patronData as FormAPISubmission).name,
          ...result.data,
        });
      })
      .catch((err) => {
        const status = err.response.status;
        let serverError = null;

        // If the response from the Patron Creator Service
        // does not include valid error details, we mark this result as
        // an internal server error.
        if (status === 401 || status === 403) {
          serverError = { type: "server" };
        }

        const restOfErrors = serverError
          ? { ...err.response.data, ...serverError }
          : err.response.data;

        logger.error(
          `Error calling Card Creator API: ${
            status === 403 ? "bad API call" : err.response.data.message
          }`
        );
        return res.status(err.response.status).json({
          status: err.response.status,
          ...restOfErrors,
        });
      });
  }

  // Else return a no token error.
  const tokenGenerationError =
    "The access token could not be generated before calling the Card Creator API.";

  logger.error(tokenGenerationError);
  return res
    .status(500)
    .json(
      constructProblemDetail(
        500,
        "no-access-token",
        "No Access Token",
        tokenGenerationError
      )
    );
}
