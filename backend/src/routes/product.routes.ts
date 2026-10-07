import express from 'express';

import authentication from '../authentication/authentication.js';
import authorization from '../authentication/authorization.js';
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  productList,
  updateProduct,
} from '../controllers/product.controller.js';

const productRouters = express.Router();

productRouters.get('/', authentication, getAllProduct);
productRouters.get('/list', authentication, productList);

productRouters.post(
  '/',
  authentication,
  authorization('PRODUCTS', 'create'),
  createProduct,
);
productRouters.patch(
  '/:id',
  authentication,
  authorization('PRODUCTS', 'edit'),
  updateProduct,
);
productRouters.delete(
  '/',
  authentication,
  authorization('PRODUCTS', 'delete'),
  deleteProduct,
);

export default productRouters;
