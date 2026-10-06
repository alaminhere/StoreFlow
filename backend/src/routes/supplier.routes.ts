import express from 'express';
import authentication from '../authentication/authentication.js';
import {
  createSupplier,
  deleteSupplier,
  getAllSupplier,
  suppliersList,
  updateSupplier,
} from '../controllers/suppliers.controller.js';
import authorization from '../authentication/authorization.js';

const supplierRouters = express.Router();

supplierRouters.get('/', authentication, getAllSupplier);
supplierRouters.get('/list', authentication, suppliersList);

supplierRouters.post(
  '/',
  authentication,
  authorization('SUPPLIERS', 'create'),
  createSupplier,
);
supplierRouters.patch(
  '/:id',
  authentication,
  authorization('SUPPLIERS', 'edit'),
  updateSupplier,
);
supplierRouters.delete(
  '/',
  authentication,
  authorization('SUPPLIERS', 'delete'),
  deleteSupplier,
);

export default supplierRouters;
