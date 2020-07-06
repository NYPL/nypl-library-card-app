/* eslint-disable */
import axios from "axios";
import qs from "qs";
import moment from "moment";
import isEmpty from "lodash/isEmpty";
import { isEmail, isAlphanumeric, isNumeric, isLength } from "validator";
import config from "../../../../appConfig";

const authConfig = {
  client_id: config.clientId,
  client_secret: config.clientSecret,
  grant_type: "client_credentials",
};

function constructApiHeaders(token = "", contentType = "application/json") {
  return {
    headers: {
      "Content-Type": contentType,
      Authorization: `Bearer ${token}`,
    },
    timeout: 10000,
  };
}

function constructErrorObject(
  type = "general-error",
  message = "There was an error with your request",
  status = 400,
  details
) {
  const response = {
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
}

function constructPatronObject(object) {
  const {
    firstName,
    lastName,
    email,
    dateOfBirth,
    line1,
    line2 = "",
    city,
    state,
    zip,
    username,
    pin,
    ecommunicationsPref,
    agencyType,
  } = object;

  const errorObj = {};

  if (isEmpty(firstName)) {
    Object.assign(errorObj, { firstName: "First Name field is empty." });
  }

  if (isEmpty(lastName)) {
    Object.assign(errorObj, { lastName: "Last Name field is empty." });
  }

  if (isEmpty(dateOfBirth)) {
    Object.assign(errorObj, { dateOfBirth: "Date of Birth field is empty." });
  }

  if (isEmpty(line1)) {
    Object.assign(errorObj, { line1: "Street Address field is empty." });
  }

  if (isEmpty(city)) {
    Object.assign(errorObj, { city: "City field is empty." });
  }

  if (isEmpty(state)) {
    Object.assign(errorObj, { state: "State field is empty." });
  }

  if (isEmpty(zip)) {
    Object.assign(errorObj, { zip: "Postal Code field is empty." });
  }

  if (
    !isEmpty(zip) &&
    (!isNumeric(zip) || !isLength(zip, { min: 5, max: 5 }))
  ) {
    Object.assign(errorObj, { zip: "Please enter a 5-digit postal code." });
  }

  // if (isEmpty(email)) {
  //   Object.assign(errorObj, { email: 'Email field is empty.' });
  // } else if (!isEmpty(email.trim()) && !isEmail(email)) {
  //   Object.assign(errorObj, { email: 'Please enter a valid email address.' });
  // }

  if (isEmpty(username)) {
    Object.assign(errorObj, { username: "Username field is empty." });
  }

  if (
    !isEmpty(username) &&
    (!isAlphanumeric(username) || !isLength(username, { min: 5, max: 25 }))
  ) {
    Object.assign(errorObj, {
      username: "Please enter a username between 5-25 alphanumeric characters.",
    });
  }

  if (isEmpty(pin)) {
    Object.assign(errorObj, { pin: "PIN field is empty." });
  }

  if (
    !isEmpty(pin) &&
    (!isNumeric(pin) || !isLength(pin, { min: 4, max: 4 }))
  ) {
    Object.assign(errorObj, { pin: "Please enter a 4-digit PIN." });
  }

  if (errorObj && !isEmpty(errorObj)) {
    return constructErrorObject(
      "server-validation-error",
      "server side validation error",
      400,
      errorObj
    );
  }

  const fullName = `${lastName.trim()}, ${firstName.trim()}`;
  const addressObject = {
    line1,
    line2,
    city,
    state,
    zip,
  };

  return {
    name: fullName,
    email,
    birthdate: dateOfBirth,
    address: addressObject,
    username,
    pin,
    ecommunicationsPref,
    patron_agency: agencyType || config.agencyType.default,
  };
}

function isTokenExipring(expirationTime, timeThreshold = 5, type = "minutes") {
  return expirationTime.diff(moment(), type) < timeThreshold;
}

// App-level cache object for API token related variables to be used in
// `initializeAppAuth` and `createPatron`.
const app = {};

export async function initializeAppAuth(req, res) {
  // TODO: Update the logger. `req.app` no longer exists and was used
  // specifically from express.
  // req.app.get('logger').info('initializeAppAuth');
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
          // req.app.get('logger').error('No access_token obtained from OAuth Service.');
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
        // req.app.get('logger').error(error);
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
    isTokenExipring(tokenExpTime, minuteExpThreshold)
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
        // req.app.get('logger').error(error);
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

function validatePatronUsername(req, value, token) {
  return axios
    .post(
      `${config.api.validate}/username`,
      { username: value },
      constructApiHeaders(token)
    )
    .catch((err) =>
      Promise.reject(new Error(`Error validating username: ${err.message}`))
    );
}

export async function createPatron(req, res) {
  const tokenObject = app["tokenObject"];
  if (tokenObject && tokenObject.access_token) {
    const token = tokenObject.access_token;
    const patronData = constructPatronObject(req.body);

    if (patronData.status === 400) {
      return res.status(400).json(patronData);
    }

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
          // req.app.get('logger').error('Error calling Card Creator API: ', err.message);
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
  res.status(400).json({
    status: 500,
    response: "The access token could not be generated.",
  });
}
