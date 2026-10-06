import express from 'express';
import authentication from '../authentication/authentication.js';
import {
  categoryList,
  createCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from '../controllers/category.controller.js';
import authorization from '../authentication/authorization.js';

const categoryRouters = express.Router();

categoryRouters.get('/', authentication, getAllCategory);
categoryRouters.get('/list', authentication, categoryList);

categoryRouters.post(
  '/',
  authentication,
  authorization('CATEGORIES', 'create'),
  createCategory,
);
categoryRouters.patch(
  '/:id',
  authentication,
  authorization('CATEGORIES', 'edit'),
  updateCategory,
);
categoryRouters.delete(
  '/',
  authentication,
  authorization('CATEGORIES', 'delete'),
  deleteCategory,
);

export default categoryRouters;
