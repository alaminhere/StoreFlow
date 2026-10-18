import express from 'express';

import authentication from '../authentication/authentication.js';
import {
  createReturn,
  getAllReturns,
} from '../controllers/return.controller.js';
import authorization from '../authentication/authorization.js';

const returnRouters = express.Router();

returnRouters.post(
  '/',
  authentication,
  authorization('RETURNS', 'create'),
  createReturn,
);
returnRouters.get(
  '/',
  authentication,
  authorization('RETURNS', 'view'),
  getAllReturns,
);

export default returnRouters;
