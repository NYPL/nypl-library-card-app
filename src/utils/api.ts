/* eslint-disable */
import axios from "axios";
import qs from "qs";
import moment from "moment";
import isEmpty from "lodash/isEmpty";
import { isEmail, isAlphanumeric, isNumeric, isLength } from "validator";
import Cors from "cors";
import config from "../../appConfig";
import logger from "../logger/index";
import { Address } from "../interfaces";

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

const constructApiHeaders = (token = "", contentType = "application/json") => ({
  headers: {
    "Content-Type": contentType,
    Authorization: `Bearer ${token}`,
  },
  timeout: 10000,
});

const constructErrorObject = (
  type = "general-error",
  message = "There was an error with your request",
  status = 400,
  details
) => {
  const response: any = {
    status,
    response: {
      type,
      message,
    },
  };

  if (!isEmpty(details)) {
    response.response.details = details;
  }

  return response;
};

export interface AddressesType {
  home: Partial<Address>;
  work?: Partial<Address>;
}
/**
 * constructAddresses
 * Address form fields have "home-" or "work-" as prefixes in their name
 * attribute, such as "home-line1" or "home-city". We need to remove the prefix
 * and create objects for the home and work addresses.
 * @param object FormData object from the client's form submission.
 */
export const constructAddresses = (object = {}) => {
  const addresses: AddressesType = { home: {}, work: {} };

  // Remove the addresses fields' prefix and add to the proper object.
  const prefixes = ["home", "work"];
  Object.keys(object).forEach((key) => {
    prefixes.forEach((prefix) => {
      if (key.indexOf(`${prefix}-`) !== -1) {
        const field = key.split("-")[1];
        addresses[prefix][field] = object[key];
      }
    });
  });

  return addresses;
};

const constructPatronObject = (object) => {
  const {
    firstName,
    lastName,
    email,
    birthdate,
    username,
    pin,
    ecommunicationsPref,
    agencyType,
    usernameHasBeenValidated,
    policyType,
    ageGate,
    homeLibraryCode,
  } = object;

  const addresses: AddressesType = constructAddresses(object);

  let errorObj = {};

  if (isEmpty(firstName)) {
    errorObj = { ...errorObj, firstName: "First Name field is empty." };
  }

  if (isEmpty(lastName)) {
    errorObj = { ...errorObj, lastName: "Last Name field is empty." };
  }

  if (policyType === "webApplicant" && isEmpty(birthdate)) {
    errorObj = { ...errorObj, birthdate: "Date of Birth field is empty." };
  } else if (policyType === "simplye" && !ageGate) {
    errorObj = {
      ...errorObj,
      ageGate: "You must be 13 years or older to continue.",
    };
  }

  if (isEmpty(addresses.home.line1)) {
    errorObj = { ...errorObj, line1: "Street Address field is empty." };
  }

  if (isEmpty(addresses.home.city)) {
    errorObj = { ...errorObj, city: "City field is empty." };
  }

  if (isEmpty(addresses.home.state)) {
    errorObj = { ...errorObj, state: "State field is empty." };
  }

  if (isEmpty(addresses.home.zip)) {
    errorObj = { ...errorObj, zip: "Postal Code field is empty." };
  }

  if (
    !isEmpty(addresses.home.zip) &&
    (!isNumeric(addresses.home.zip) ||
      !isLength(addresses.home.zip, { min: 5, max: 5 }))
  ) {
    errorObj = { ...errorObj, zip: "Please enter a 5-digit postal code." };
  }

  // if (isEmpty(email)) {
  //   errorObj = { ...errorObj, email: 'Email field is empty.' };
  // } else if (!isEmpty(email.trim()) && !isEmail(email)) {
  //   errorObj = { ...errorObj, email: 'Please enter a valid email address.' };
  // }

  if (isEmpty(username)) {
    errorObj = { ...errorObj, username: "Username field is empty." };
  }

  if (
    !isEmpty(username) &&
    (!isAlphanumeric(username) || !isLength(username, { min: 5, max: 25 }))
  ) {
    errorObj = {
      ...errorObj,
      username: "Please enter a username between 5-25 alphanumeric characters.",
    };
  }

  if (isEmpty(pin)) {
    errorObj = { ...errorObj, pin: "PIN field is empty." };
  }

  if (
    !isEmpty(pin) &&
    (!isNumeric(pin) || !isLength(pin, { min: 4, max: 4 }))
  ) {
    errorObj = { ...errorObj, pin: "Please enter a 4-digit PIN." };
  }

  if (errorObj && !isEmpty(errorObj)) {
    return constructErrorObject(
      "server-validation-error",
      "server side validation error",
      400,
      errorObj
    );
  }

  const fullName = `${firstName.trim()} ${lastName.trim()}`;
  const boolMap = { true: true, false: false };
  const usernameHasBeenValidatedBool = boolMap[usernameHasBeenValidated];

  return {
    name: fullName,
    email,
    birthdate,
    ageGate,
    address: addresses.home,
    workAddress: !isEmpty(addresses.work) ? addresses.work : null,
    username,
    pin,
    ecommunicationsPref,
    patron_agency: agencyType || config.agencyType.default,
    usernameHasBeenValidated: usernameHasBeenValidatedBool,
    policyType: policyType || "simplye",
    homeLibraryCode,
  };
};

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

function validatePatronAddress(req, object, token) {
  return axios
    .post(
      `${config.api.validate}/address`,
      { address: object },
      constructApiHeaders(token)
    )
    .then((response) => response.data)
    .catch((err) =>
      Promise.reject(
        new Error(`Error validating patron address: ${err.message}`)
      )
    );
}

/**
 * validatePatronUsername
 * Call the Card Creator API to validate a username.
 */
export async function validatePatronUsername(req, res) {
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
    if (patronData.status === 400) {
      return res.status(400).json(patronData);
    }

    console.log("patrondata", patronData);

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
    return res.status(200).json({
      status: 200,
      type: "card-granted",
      link: "some-link",
      barcode: "12345678912345",
      username: "tomnook",
      pin: "1234",
      temporary: false,
      message: "The library card will be a standard library card.",
      patronId: 1234567,
    });

    return axios
      .post(config.api.patron, patronData, constructApiHeaders(token))
      .then((result) => {
        return res.json({
          status: result.data.status,
          ...result.data,
        });
      })
      .catch((err) => {
        let serverError = null;

        // If the response from the Patron Creator Service(the wrapper)
        // does not include valid error details, we mark this result as an internal server error
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
