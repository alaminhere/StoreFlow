import express from 'express';

import authentication from '../authentication/authentication.js';
import authorization from '../authentication/authorization.js';
import { createSale, getAllSale } from '../controllers/sale.controller.js';

const saleRouters = express.Router();

saleRouters.get(
  '/',
  authentication,
  authorization('SALES_HISTORY', 'view'),
  getAllSale,
);

saleRouters.post(
  '/',
  authentication,
  authorization('POS', 'create'),
  createSale,
);
export default saleRouters;
