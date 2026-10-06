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

// auth route
const authRoutes = express.Router();

authRoutes.post('/signup', signup);
authRoutes.post('/verify-signup', verifySignup);

authRoutes.post('/signin', signin);

authRoutes.post('/forgot-password', forgotPassword);
authRoutes.post('/verify-forgot-password', verifyForgotPassword);
authRoutes.post('/reset-password', resetPassword);

authRoutes.post('/signout', signout);

export default authRoutes;
