import axios from 'axios';
import qs from 'qs';
import moment from 'moment';
import config from '../../../../appConfig';

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

function constructErrorObject(property, type = 'missing-required-field', isError = true) {
  return {
    error: {
      error: isError,
      response: {
        type,
        message: `The ${property} field is missing.`,
      },
    },
  };
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


  if (!firstName) {
    return constructErrorObject('firstName');
  }

  if (!lastName) {
    return constructErrorObject('lastName');
  }

  if (!email) {
    return constructErrorObject('email');
  }

  if (!line1) {
    return constructErrorObject('address.line_1');
  }

  if (!city) {
    return constructErrorObject('address.city');
  }

  if (!state) {
    return constructErrorObject('address.state');
  }

  if (!zip) {
    return constructErrorObject('address.zip');
  }

  if (!username) {
    return constructErrorObject('username');
  }

  if (!pin) {
    return constructErrorObject('pin');
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
  const currentTime = moment();

  return (expirationTime.diff(currentTime, type) < timeThreshold);
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
      .catch(error => res.json({
        error: true,
        type: 'app-auth-failed',
        message: `Could not authenticate App on ${config.api.oauth}`,
        details: error,
      }));
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
      .catch(error => res.json({
        error: true,
        type: 'app-auth-failed',
        message: `Could not authenticate App on ${config.api.oauth}`,
        response: error,
      })
);
  }

  next();
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
      console.log(error);
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

    if (patronData.error) {
      return res.json(patronData.error);
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
        return res.json({
          error: true,
          response: patronAddressResponse,
        });
      }

      if (!patronUsernameResponse.valid) {
        // Username is invalid
        return res.json({
          error: true,
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
        .then(result => res.json({ response: result.data.data }))
        .catch(err => res.json({
          error: true,
          response: err.response.data,
        }));
    }))
    .catch(error => res.json({
      error: true,
      response: error,
    }));
  }
}
