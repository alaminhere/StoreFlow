import express from 'express';

import authentication from '../authentication/authentication.js';
import {
  createReturn,
  getAllReturns,
  getReturn,
} from '../controllers/return.controller.js';

const returnRouters = express.Router();

returnRouters.post('/', authentication, createReturn);
returnRouters.get('/', authentication, getAllReturns);
returnRouters.get('/:returnId', authentication, getReturn);

export default returnRouters;
