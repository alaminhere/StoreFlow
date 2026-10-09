import express from 'express';

import {
  getAllSupplierPayments,
  getPurchasePayments,
  getSupplierPayments,
  ReceivePurchasePayment,
} from '../controllers/purchasePayment.controller.js';
import authorization from '../authentication/authorization.js';
import authentication from '../authentication/authentication.js';
import {
  getAllCustomerPayments,
  getCustomerPayments,
  getSalePayments,
  ReceiveSalePayment,
} from '../controllers/salePayment.controller.js';

const paymentRouters = express.Router();

// purchase payment
paymentRouters.get('/supplier', authentication, getAllSupplierPayments);
paymentRouters.get(
  '/supplier/:supplierId',
  authentication,
  getSupplierPayments,
);
paymentRouters.get(
  '/purchase/:purchaseId',
  authentication,
  getPurchasePayments,
);
paymentRouters.post(
  '/purchase/receive',
  authentication,
  ReceivePurchasePayment,
);

// sale payment
paymentRouters.get('/customer', authentication, getAllCustomerPayments);
paymentRouters.get(
  '/customer/:customerId',
  authentication,
  getCustomerPayments,
);
paymentRouters.get('/sale/:saleId', authentication, getSalePayments);
paymentRouters.post('/sale/receive', authentication, ReceiveSalePayment);

export default paymentRouters;
