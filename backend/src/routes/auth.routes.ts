import express from 'express';
import {
  signup,
  verifySignup,
  signin,
  forgotPassword,
  verifyForgotPassword,
  resetPassword,
  signout,
} from '../controllers/auth.controller.js';
import { authLimiter, passwordLimiter } from '../middlewares/rateLimit.js';

// auth route
const authRoutes = express.Router();

authRoutes.post('/signup', authLimiter, signup);
authRoutes.post('/verify-signup', verifySignup);

authRoutes.post('/signin', authLimiter, signin);

authRoutes.post('/forgot-password', passwordLimiter, forgotPassword);
authRoutes.post('/verify-forgot-password', verifyForgotPassword);
authRoutes.post('/reset-password', passwordLimiter, resetPassword);

authRoutes.post('/signout', signout);

export default authRoutes;
