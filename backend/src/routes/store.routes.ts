import express from 'express';
import {
  closedStore,
  createStore,
  currentStore,
  deleteCurrentStore,
  openStore,
  UpdateCurrentStore,
} from '../controllers/store.controller.js';
import authentication from '../authentication/authentication.js';
import authorization from '../authentication/authorization.js';

const storeRoutes = express.Router();

storeRoutes.get('/', authentication, currentStore);
storeRoutes.post('/', authentication, createStore);

storeRoutes.patch(
  '/',
  authentication,
  authorization('SETTINGS', 'edit'),
  UpdateCurrentStore,
);

storeRoutes.delete(
  '/',
  authentication,
  authorization('SETTINGS', 'delete'),
  deleteCurrentStore,
);

storeRoutes.post('/open', authentication, openStore);
storeRoutes.post('/closed', authentication, closedStore);

export default storeRoutes;
