import express from 'express';
import authentication from '../authentication/authentication.js';
import uploadPdf from '../middlewares/uploadPdf.js';
import { sendInvoice } from '../controllers/invoice.controller.js';
import { emailLimiter } from '../middlewares/rateLimit.js';

const invoiceRoute = express.Router();
invoiceRoute.post(
  '/send',
  authentication,
  emailLimiter,
  uploadPdf.single('pdf'),
  sendInvoice,
);
export default invoiceRoute;
