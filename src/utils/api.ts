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
  ErrorResponse,
} from "../interfaces";
import {
  constructAddresses,
  constructPatronObject,
  constructErrorObject,
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
const isTokenExpiring = (
  expirationTime,
  timeThreshold = 5,
  type = "minutes"
): boolean => expirationTime.diff(moment(), type) < timeThreshold;

// App-level cache object for API token related variables to be used in
// `initializeAppAuth` and `createPatron`.
const app = {};

export async function initializeAppAuth(req, res) {
  logger.info("initializeAppAuth");
  const tokenObject = app["tokenObject"];
  const tokenExpTime = app["tokenExpTime"];
  const minuteExpThreshold = 10;

  if (!tokenObject) {
    return axios
      .post(config.api.oauth, qs.stringify(authConfig))
      .then((response) => {
        if (response.data) {
          app["tokenObject"] = response.data;
          app["tokenExpTime"] = moment().add(response.data.expires_in, "s");
        } else {
          logger.error("No access_token obtained from OAuth Service.");
          const errorObj = {};
          Object.assign(errorObj, {
            oauth: "No access_token obtained from OAuth Service.",
          });
          return res
            .status(400)
            .json(
              constructErrorObject(
                "no-access-token",
                "No access_token obtained from OAuth Service.",
                400,
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
            constructErrorObject(
              "app-auth-failed",
              "Could not authenticate App with OAuth service",
              400,
              error
            )
          );
      });
  }

  if (
    tokenObject.access_token &&
    isTokenExpiring(tokenExpTime, minuteExpThreshold)
  ) {
    return axios
      .post(config.api.oauth, qs.stringify(authConfig))
      .then((response) => {
        if (response.data) {
          app["tokenObject"] = response.data;
          app["tokenExpTime"] = moment().add(response.data.expires_in, "s");
        }
      })
      .catch((error) => {
        logger.error(error);
        return res
          .status(400)
          .json(
            constructErrorObject(
              "app-reauth-failed",
              "Could not re-authenticate App with OAuth service",
              400,
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
function axiosAddressPost(
  address: Address,
  isWorkAddress: boolean,
  token: string
): Promise<AddressAPIResponseData> {
  return axios
    .post(
      `${config.api.validate}/address`,
      { address, isWorkAddress },
      constructApiHeaders(token)
    )
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
function makeAddressAPICalls(
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
export async function validateAddress(req, res) {
  const tokenObject = app["tokenObject"];
  if (tokenObject && tokenObject.access_token) {
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
          message: homeData.message,
          reason: homeData.reason,
        };
        if (workData) {
          response.work = {
            address: workData?.address || workData?.originalAddress,
            addresses: workData?.addresses,
            message: workData?.message,
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
  res.status(500).json({
    status: 500,
    response: "The access token could not be generated.",
  });
}

/**
 * validateUsername
 * Call the NYPL Platform API to validate a username.
 */
export async function validateUsername(req, res) {
  const tokenObject = app["tokenObject"];
  if (tokenObject && tokenObject.access_token) {
    const token = tokenObject.access_token;
    const username = req.body.username;
    return axios
      .post(
        `${config.api.validate}/username`,
        { username },
        constructApiHeaders(token)
      )
      .then((result) => {
        return res.json({
          status: result.data.status,
          ...result.data,
        });
      })
      .catch((err) => {
        res.status(err.response.status).json({
          ...err.response?.data,
        });
      });
  }

  // Else return a no token error
  res.status(500).json({
    status: 500,
    response: "The access token could not be generated.",
  });
}

export async function createPatron(req, res) {
  const tokenObject = app["tokenObject"];
  if (tokenObject && tokenObject.access_token) {
    const token = tokenObject.access_token;
    const patronData = constructPatronObject(req.body);
    if ((patronData as ErrorResponse).status === 400) {
      return res.status(400).json(patronData);
    }

    // Just for testing purposes locally. Used to verify refs and focus are
    // properly working but also to update the server response interface/type
    // later on.
    // return res.status(400).json({
    //   status: 400,
    //   response: {
    //     type: "server-validation-error",
    //     message: "server side validation error",
    //     details: {
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
      .post(config.api.patron, patronData, constructApiHeaders(token))
      .then((result) => {
        console.log("result", result.data);
        return res.json({
          status: result.data.status,
          name: result.data.name,
          ...result.data,
        });
      })
      .catch((err) => {
        let serverError = null;

        // If the response from the Patron Creator Service(the wrapper)
        // does not include valid error details, we mark this result as
        // an internal server error.
        if (!err.response.data) {
          logger.error("Error calling Card Creator API: ", err.message);
          serverError = { type: "server" };
        }

        res.status(err.response.status).json({
          status: err.response.status,
          response: serverError
            ? Object.assign(err.response.data, serverError)
            : err.response.data,
        });
      });
  }
  // Else return a no token error
  res.status(500).json({
    status: 500,
    response: "The access token could not be generated.",
  });
}
