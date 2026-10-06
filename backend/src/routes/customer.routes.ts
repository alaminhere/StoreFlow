import express from 'express';
import authentication from '../authentication/authentication.js';
import authorization from '../authentication/authorization.js';
import { createCustomers, customersList, deleteCustomer, getAllCustomer, updateCustomer } from '../controllers/customers.controller.js';

const customerRouters = express.Router();

customerRouters.get('/', authentication, getAllCustomer);
customerRouters.get('/list', authentication, customersList);

customerRouters.post(
  '/',
  authentication,
  authorization('CUSTOMERS', 'create'),
  createCustomers,
);
customerRouters.patch(
  '/:id',
  authentication,
  authorization('CUSTOMERS', 'edit'),
  updateCustomer,
);
customerRouters.delete(
  '/',
  authentication,
  authorization('CUSTOMERS', 'delete'),
  deleteCustomer,
);

export default customerRouters;
