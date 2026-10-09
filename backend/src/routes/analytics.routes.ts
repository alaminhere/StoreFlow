import express from 'express';

import authentication from '../authentication/authentication.js';
import {
  getDashboardCards,
  getDashboardOverview,
} from '../controllers/dashboard.controller.js';
import authorization from '../authentication/authorization.js';
const analyticsRouters = express.Router();

analyticsRouters.get(
  '/overview',
  authentication,
  authorization('ANALYTICS', 'view'),
  getDashboardOverview,
);
analyticsRouters.get(
  '/cards',
  authentication,
  authorization('ANALYTICS', 'view'),
  getDashboardCards,
);
export default analyticsRouters;
