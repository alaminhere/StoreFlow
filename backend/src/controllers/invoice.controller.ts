import type { Request, Response, NextFunction } from 'express';
import ApiError from '../helpers/apiError.js';
import sendInvoiceEmail from '../helpers/email/sendInvoiceEmail.js';
import { sendInvoiceSchema } from '../validations/sendInvoice.validation.js';
import sendResponse from '../helpers/sendResponse.js';

export const sendInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      throw new ApiError(400, 'PDF file is required');
    }
    if (req.file.buffer.subarray(0, 4).toString() !== '%PDF') {
      throw new ApiError(400, 'Invalid PDF file');
    }

    const { to, invoiceNo, partyName, storeName } = sendInvoiceSchema.parse(
      req.body,
    );
    await sendInvoiceEmail({
      to,
      invoiceNo,
      partyName,
      storeName,
      pdfBuffer: req.file.buffer,
    });

    return sendResponse(res, 200, true, 'Invoice sent successfully');
  } catch (err) {
    next(err);
  }
};
