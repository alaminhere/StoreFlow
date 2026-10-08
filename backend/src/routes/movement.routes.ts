import express from 'express';

import authentication from '../authentication/authentication.js';
import {
  createStockMovement,
  getAllStockMovement,
  getStockMovementsByProductId,
} from '../controllers/movement.controller.js';

const movementRouters = express.Router();

movementRouters.post('/', authentication, createStockMovement);
movementRouters.get('/', authentication, getAllStockMovement);
movementRouters.get(
  '/:productId',
  authentication,
  getStockMovementsByProductId,
);

export default movementRouters;
