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
userRoutes.patch('/me/profile', authentication, updateMyProfile);
userRoutes.patch('/me/password', authentication, updateMyPassword);
userRoutes.delete('/me/delete', authentication, deleteMyAccount);

export default userRoutes;
