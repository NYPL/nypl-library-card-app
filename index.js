if (process.env.NODE_ENV !== 'production') {
  // in development mode we like to keep environment vars in ./.env
  require('dotenv').config();
};

require('babel-register');
module.exports = require('./server');
