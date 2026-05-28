import axios from "axios";
import qs from "qs";
import moment from "moment";
import Cors from "cors";

import * as config from "../../appConfig";
import logger from "../logger/index";
import { constructPatronObject } from "./formDataUtils";
import {
  AddressAPIResponseData,
  AddressAPIRequestData,
  FormAPISubmission,
  AddressResponse,
} from "../interfaces";
import { validateCsrfToken } from "./csrfUtils";
import { ApiError, ErrorCodes, ErrorCode } from "../errors";

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
 * API endpoints. If there is no access token available, one will be requested
 * with an API call and stored in the `app` variable. If there is a token
 * available, but it's expiring in less than ten minutes, then make a request
 * to get a new access token.
 *
 * Throws ApiError on authentication failure rather than writing to the
 * response directly — callers are responsible for handling the error.
 *
 * Note: appObj is used to make testing easier.
 */
export async function initializeAppAuth(req, appObj = app) {
  logger.info("initializeAppAuth");
  const tokenObject = appObj["tokenObject"];
  const tokenExpTime = appObj["tokenExpTime"];
  const minuteExpThreshold = 10;

  const fetchToken = async (reason: string) => {
    let response;
    try {
      response = await axios.post(config.api.oauth, qs.stringify(authConfig));
    } catch (error) {
      logger.error(`OAuth request failed (${reason})`, { error });
      throw new ApiError(
        502,
        ErrorCodes.AUTH_FAILED,
        "Could not authenticate App with OAuth service"
      );
    }
    if (!response.data?.access_token) {
      logger.error(`No access_token in OAuth response (${reason})`);
      throw new ApiError(
        502,
        ErrorCodes.AUTH_FAILED,
        "No access token returned from the OAuth service."
      );
    }
    app["tokenObject"] = response.data;
    app["tokenExpTime"] = moment().add(response.data.expires_in, "s");
  };

  // There's no token object at all. This is the initial case before the first
  // API call. Let's request one and store it.
  if (!tokenObject?.access_token) {
    await fetchToken("initial");
    return;
  }

  // If there is an access token available but it will expire within ten
  // minutes, then request a new access token.
  if (isTokenExpiring(tokenExpTime, minuteExpThreshold)) {
    logger.warning(
      "The access_token is expiring. Requesting a new access token"
    );
    await fetchToken("refresh");
  }
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
 *
 * Returns { status, data } on success or PCS errors
 * (e.g. multiple address matches). Throws ApiError for app
 * failures (CSRF, missing token, network timeout).
 */
export async function validateAddress(
  req,
  appObj = app
): Promise<{ status: number; data: AddressResponse }> {
  if (!validateCsrfToken(req)) {
    throw new ApiError(
      403,
      ErrorCodes.CSRF_INVALID,
      "Form session expired. Please refresh the page and try again."
    );
  }

  const tokenObject = appObj["tokenObject"];
  if (!tokenObject?.access_token) {
    throw new ApiError(
      500,
      ErrorCodes.AUTH_TOKEN_MISSING,
      "Authentication token unavailable. Please try again."
    );
  }

  const token = tokenObject.access_token;
  const addressRequest: AddressAPIRequestData = {
    address: req.body.address,
    isWorkAddress: req.body.isWorkAddress,
  };

  const result = await axiosAddressPost(addressRequest, token);

  const httpStatus = Number(result.status) || 0;
  if (!httpStatus || httpStatus >= 500) {
    throw new ApiError(
      502,
      ErrorCodes.PLATFORM_API_ERROR,
      "Address validation service is currently unavailable. Please try again."
    );
  }

  const response: AddressResponse = {
    address: result?.address || result.originalAddress,
    addresses: result?.addresses,
    success: result.success,
    cardType: result.cardType,
    detail: result.detail || result.message,
    reason: result.reason,
  };

  return { status: httpStatus, data: response };
}

export async function validateUsername(
  req,
  validateUrl = `${config.api.validate}/username`,
  appObj = app
): Promise<{ status: number; data: object }> {
  if (!validateCsrfToken(req)) {
    throw new ApiError(
      403,
      ErrorCodes.CSRF_INVALID,
      "Form session expired. Please refresh the page and try again."
    );
  }

  const tokenObject = appObj["tokenObject"];
  if (!tokenObject?.access_token) {
    throw new ApiError(
      500,
      ErrorCodes.AUTH_TOKEN_MISSING,
      "Cannot validate usernames at this time."
    );
  }

  const token = tokenObject.access_token;
  const username = req.body.username;

  try {
    const result = await axios.post(
      validateUrl,
      { username },
      constructApiHeaders(token)
    );
    const appStatus = result.data?.status ?? 200;
    return { status: appStatus, data: { status: appStatus, ...result.data } };
  } catch (err) {
    const status = err.response?.status;
    if (!status || status >= 500) {
      throw new ApiError(
        502,
        ErrorCodes.PLATFORM_API_ERROR,
        "Cannot validate usernames at this time."
      );
    }
    // PCS returns 4xx (e.g. username unavailable), let's return as-is for client handling.
    return { status, data: { status, ...err.response?.data } };
  }
}

/**
 * createPatron
 * Validates CSRF, calls the NYPL Patrons API to create an ILS account,
 * and returns the result or throws a typed ApiError.
 */
export async function createPatron(
  req,
  createPatronUrl = config.api.patron,
  appObj = app
) {
  if (!validateCsrfToken(req)) {
    throw new ApiError(
      403,
      ErrorCodes.CSRF_INVALID,
      "Form session expired. Please refresh the page and try again."
    );
  }

  const tokenObject = appObj["tokenObject"];
  if (!tokenObject?.access_token) {
    throw new ApiError(
      500,
      ErrorCodes.AUTH_TOKEN_MISSING,
      "The access token could not be generated before calling the Card Creator API."
    );
  }

  const token = tokenObject.access_token;
  const patronData = constructPatronObject(req.body);
  if ((patronData as { status?: number }).status === 400) {
    const pd = patronData as {
      status: number;
      detail?: string;
      error?: object;
    };
    logger.error("Invalid patron data", { patronData });
    throw new ApiError(
      400,
      ErrorCodes.INVALID_REQUEST,
      pd.detail || "There was an error with the submitted form values.",
      pd.error ? { fields: pd.error } : undefined
    );
  }

  logger.debug(
    `POSTing patron data with username ${
      (patronData as FormAPISubmission).username
    } to ${createPatronUrl}`
  );

  try {
    const result = await axios.post(
      createPatronUrl,
      patronData,
      constructApiHeaders(token)
    );
    if (!result.data?.status) throw result;
    const fullName = `${(patronData as FormAPISubmission).firstName} ${
      (patronData as FormAPISubmission).lastName
    }`;
    return { status: result.data.status, name: fullName, ...result.data };
  } catch (err) {
    console.log("ERROR", err);
    const status = err.response?.status;

    if (err.message && (!err.response || !status)) {
      logger.error("Card Creator API request failed", { message: err.message });
      throw new ApiError(
        502,
        ErrorCodes.PLATFORM_API_ERROR,
        "Bad response from Card Creator API"
      );
    }

    const apiResponse = err.response?.data;
    logger.error("Error calling Card Creator API", {
      status,
      data: apiResponse,
    });

    throw new ApiError(
      status,
      mapPatronErrorCode(apiResponse?.type),
      apiResponse?.detail || apiResponse?.message || "Patron creation failed.",
      apiResponse?.error ? { fields: apiResponse.error } : undefined
    );
  }
}

/**
 * mapPatronErrorCode
 * Maps Patron Creator Service API error `type` strings to our ErrorCodes.
 * https://github.com/NYPL/dgx-patron-creator-service/wiki/API-V0.3#error-responses-2
 */
function mapPatronErrorCode(type?: string): ErrorCode {
  switch (type) {
    case "missing-required-values":
      return ErrorCodes.MISSING_REQUIRED_FIELDS;
    case "invalid-username":
      return ErrorCodes.INVALID_USERNAME;
    case "unavailable-username":
      return ErrorCodes.USERNAME_UNAVAILABLE;
    case "ils-integration-error":
      return ErrorCodes.ILS_INTEGRATION_ERROR;
    default:
      return ErrorCodes.PATRON_CREATION_FAILED;
  }
}
