import express from 'express';

import authentication from '../authentication/authentication.js';
import authorization from '../authentication/authorization.js';
import {
  createSale,
  getAllSale,
  getSaleForReturn,
} from '../controllers/sale.controller.js';

const saleRouters = express.Router();

saleRouters.get(
  '/',
  authentication,
  authorization('SALES_HISTORY', 'view'),
  getAllSale,
);
saleRouters.get(
  '/:id',
  authentication,
  authorization('RETURNS', 'create'),
  getSaleForReturn,
);

saleRouters.post(
  '/',
  authentication,
  authorization('POS', 'create'),
  createSale,
);
export default saleRouters;
