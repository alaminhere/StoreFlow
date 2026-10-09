import express from 'express';

import authentication from '../authentication/authentication.js';
import {
  getDashboardCards,
  getDashboardOverview,
} from '../controllers/dashboard.controller.js';
const dashboardRouters = express.Router();

dashboardRouters.get('/overview', authentication, getDashboardOverview);
dashboardRouters.get('/cards', authentication, getDashboardCards);
export default dashboardRouters;
