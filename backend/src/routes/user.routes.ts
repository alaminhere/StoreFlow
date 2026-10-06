import express from 'express';
import authentication from '../authentication/authentication.js';
import {
  deleteMyAccount,
  getCurrentUser,
  updateMyPassword,
  updateMyProfile,
  userByEmail,
} from '../controllers/user.controller.js';

const userRoutes = express.Router();

userRoutes.get('/me', authentication, getCurrentUser);
userRoutes.get('/email', authentication, userByEmail);
userRoutes.post('/me/profile', authentication, updateMyProfile);
userRoutes.post('/me/password', authentication, updateMyPassword);
userRoutes.post('/me/delete', authentication, deleteMyAccount);

export default userRoutes;
