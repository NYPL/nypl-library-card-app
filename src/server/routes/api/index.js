import axios from 'axios';
import config from '../../../../appConfig.js';

function constructApiHeaders(token = '') {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
}

export function getData(req, res, next) {

}
