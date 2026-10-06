import express from 'express';
import {
  brandList,
  createBrand,
  deleteBrand,
  getAllBrand,
  updateBrand,
} from '../controllers/brand.controller.js';
import authentication from '../authentication/authentication.js';
import authorization from '../authentication/authorization.js';

const brandRouters = express.Router();

brandRouters.get('/', authentication, getAllBrand);
brandRouters.get('/list', authentication, brandList);

brandRouters.post(
  '/',
  authentication,
  authorization('BRANDS', 'create'),
  createBrand,
);
brandRouters.patch(
  '/:id',
  authentication,
  authorization('BRANDS', 'edit'),
  updateBrand,
);
brandRouters.delete(
  '/',
  authentication,
  authorization('BRANDS', 'delete'),
  deleteBrand,
);

export default brandRouters;
