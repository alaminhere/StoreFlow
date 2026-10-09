import express from 'express';

import authentication from '../authentication/authentication.js';
import authorization from '../authentication/authorization.js';
import {
  createPurchases,
  getAllPurchases,
  getPurchaseForReturn,
} from '../controllers/purchases.controller.js';

const purchaseRouters = express.Router();

purchaseRouters.get(
  '/',
  authentication,
  authorization('PURCHASES', 'view'),
  getAllPurchases,
);
purchaseRouters.get(
  '/:id',
  authentication,
  authorization('PURCHASES', 'view'),
  getPurchaseForReturn,
);

purchaseRouters.post(
  '/',
  authentication,
  authorization('PURCHASES', 'create'),
  createPurchases,
);
export default purchaseRouters;
