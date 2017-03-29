import axios from 'axios';
import qs from 'qs';
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

function constructErrorObject(property, type = 'missing-required-field') {
  return {
    error: {
      type,
      valid: false,
      message: `The ${property} field is missing.`,
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

  const fullName = `${firstName.trim()} ${lastName.trim()}`;
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

export function initializeAppAuth(req, res, next) {
  axios
    .post(config.api.oauth, qs.stringify(authConfig))
    .then((response) => {
      req.tokenObject = response.data;
      next();
    })
    .catch((error) => {
      console.log(`Could not authorize App on ${config.api.oauth}`, error);
      res.json({
        error_type: 'auth_failed',
        error_desc: error,
      });
    });
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
  if (req.tokenObject && req.tokenObject.access_token) {
    // res.json(req.tokenObject);
    const token = req.tokenObject.access_token;
    const patronData = constructPatronObject(req.body);

    if (patronData.error) {
      return res.json(patronData.error);
    }
    // Patron Object validation is successful
    // Validate Address and Username
    axios.all([
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
        return res.json(patronAddressResponse);
      }

      if (!patronUsernameResponse.valid) {
        // Username is invalid
        return res.json(patronUsernameResponse);
      }

      // Patron address is valid, create account
      axios
        .post(
          config.api.patron,
          { simplePatron: patronData },
          constructApiHeaders(token),
        )
        .then((result) => {
          console.log(result.data);
          return res.json(result.data.data);
        })
        .catch((err) => {
          console.log('Error Creating Account: ', err.response.data);
          return res.json(err.response.data);
        });
    }))
    .catch((error) => {
      console.log(error);
    });
  }
}
