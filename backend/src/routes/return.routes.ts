import express from 'express';

import authentication from '../authentication/authentication.js';
import {
  createReturn,
  getAllReturns,
} from '../controllers/return.controller.js';

const returnRouters = express.Router();

returnRouters.post('/', authentication, createReturn);
returnRouters.get('/', authentication, getAllReturns);

export default returnRouters;
