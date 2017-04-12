import axios from 'axios';
import qs from 'qs';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import { isEmail, isAlphanumeric, isNumeric, isLength } from 'validator';
import config from '../../../../appConfig';
// Logger middleware
import { logger } from './src/server/utils';

const authConfig = {
  client_id: config.clientId,
  client_secret: config.clientSecret,
  grant_type: 'client_credentials',
};

function constructApiHeaders(token = '', contentType = 'application/json') {
  return {
    headers: {
      'Content-Type': contentType,
      Authorization: `Bearer ${token}`,
    },
  };
}

function constructErrorObject(type = 'general-error', message = 'There was an error with your request', status = 400, details) {
  const response = {
    status,
    response: {
      type,
      message,
    },
  };

  if (!isEmpty(details)) {
    response.details = details;
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
    line2 = '',
    city,
    state,
    zip,
    username,
    pin,
  } = object;


  if (isEmpty(firstName)) {
    return constructErrorObject('missing-required-field', 'The firstName field is missing.');
  }

  if (isEmpty(lastName)) {
    return constructErrorObject('missing-required-field', 'The lastName field is missing.');
  }

  if (isEmpty(email)) {
    return constructErrorObject('missing-required-field', 'The email field is missing.');
  }

  if (!isEmail(email)) {
    return constructErrorObject('invalid-field', 'The email field is invalid.');
  }

  if (isEmpty(line1)) {
    return constructErrorObject('missing-required-field', 'The line_1 field is missing.');
  }

  if (isEmpty(city)) {
    return constructErrorObject('missing-required-field', 'The city field is missing.');
  }

  if (isEmpty(state)) {
    return constructErrorObject('missing-required-field', 'The state field is missing.');
  }

  if (isEmpty(zip)) {
    return constructErrorObject('missing-required-field', 'The zip field is missing.');
  }

  if (!isNumeric(zip) || !isLength(zip, { min: 5, max: 5 })) {
    return constructErrorObject('invalid-field', 'The zip field is must be 5 numbers.');
  }

  if (isEmpty(username)) {
    return constructErrorObject('missing-required-field', 'The username field is missing.');
  }

  if (!isAlphanumeric(username)) {
    return constructErrorObject('invalid-field', 'The username field must be alphanumeric');
  }

  if (isEmpty(pin)) {
    return constructErrorObject('missing-required-field', 'The pin field is missing.');
  }

  if (!isNumeric(pin) || !isLength(pin, { min: 4, max: 4 })) {
    return constructErrorObject('invalid-field', 'The pin field is must be 4 numbers.');
  }

  const fullName = `${lastName.trim()}, ${firstName.trim()}`;
  const addressObject = {
    line_1: line1,
    line_2: line2,
    city,
    state,
    zip,
  };

  return {
    name: fullName,
    email,
    address: addressObject,
    username,
    pin,
  };
}

function isTokenExipring(expirationTime, timeThreshold = 5, type = 'minutes') {
  return (expirationTime.diff(moment(), type) < timeThreshold);
}

export function initializeAppAuth(req, res, next) {
  const tokenObject = req.app.get('tokenObject');
  const tokenExpTime = req.app.get('tokenExpTime');
  const minuteExpThreshold = 10;

  if (!tokenObject) {
    return axios
      .post(config.api.oauth, qs.stringify(authConfig))
      .then((response) => {
        if (response.data) {
          req.app.set('tokenObject', response.data);
          req.app.set('tokenExpTime', moment().add(response.data.expires_in, 's'));
        }
        next();
      })
      .catch(error => res.status(400).json(constructErrorObject(
        'app-auth-failed',
        'Could not authenticate App with OAuth service',
        400,
        error,
      )));
  }

  if (tokenObject.access_token && isTokenExipring(tokenExpTime, minuteExpThreshold)) {
    return axios
      .post(config.api.oauth, qs.stringify(authConfig))
      .then((response) => {
        if (response.data) {
          req.app.set('tokenObject', response.data);
          req.app.set('tokenExpTime', moment().add(response.data.expires_in, 's'));
        }
        next();
      })
      .catch(error => res.status(400).json(constructErrorObject(
        'app-reauth-failed',
        'Could not re-authenticate App with OAuth service',
        400,
        error,
      )));
  }

  return next();
}

function validatePatronAddress(object, token) {
  return axios
    .post(
      `${config.api.validate}/address`,
      { address: object },
      constructApiHeaders(token),
    )
    .then(response => response.data)
    .catch((error) => {
        req.app.get('logger').error(error);
    });
}

function validatePatronUsername(value, token) {
  return axios
    .post(
      `${config.api.validate}/username`,
      { username: value },
      constructApiHeaders(token),
    );
}

export function createPatron(req, res) {
  const tokenObject = req.app.get('tokenObject');
  if (tokenObject && tokenObject.access_token) {
    const token = tokenObject.access_token;
    const patronData = constructPatronObject(req.body);

    if (patronData.status === 400) {
      return res.status(400).json(patronData);
    }
    // Patron Object validation is successful
    // Validate Address and Username
    return axios.all([
      validatePatronAddress(patronData.address, token),
      validatePatronUsername(patronData.username, token),
    ])
    .then(axios.spread((addressResponse, userRes) => {
      // Both requests are now complete
      const patronAddressResponse = addressResponse.data || {};
      const patronUsernameResponse = (userRes && userRes.data && userRes.data.data) ?
        userRes.data.data : {};

      if (!patronAddressResponse.valid) {
        // Address is invalid
        return res.status(400).json({
          status: 400,
          response: patronAddressResponse,
        });
      }

      if (!patronUsernameResponse.valid) {
        // Username is invalid
        return res.status(400).json({
          status: 400,
          response: patronUsernameResponse,
        });
      }

      // Patron address is valid, create account
      return axios
        .post(
          config.api.patron,
          { simplePatron: patronData },
          constructApiHeaders(token),
        )
        .then(result => res.json({ status: 200, response: result.data.data }))
        .catch(err => res.status(400).json({
          status: 400,
          response: err.response.data,
        }));
    }))
    .catch(error => res.status(400).json({
      status: 400,
      response: error,
    }));
  }
}
