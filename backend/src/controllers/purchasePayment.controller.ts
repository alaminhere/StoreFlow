import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/db.js';
import ApiError from '../helpers/apiError.js';
import sendResponse from '../helpers/sendResponse.js';
import { ReceivedPurchasePaymentSchema } from '../validations/payment.validation.js';
import { emitToStore } from '../helpers/socket/socket.js';
import { Prisma } from '../generated/prisma/client.js';
import { PAGINATION } from '../constants/index.js';

/*-----------------------------------------*
 * Returns all supplier payments
 *-----------------------------------------*/
export const getAllSupplierPayments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId!;
    const { page } = req.query;

    const limit = PAGINATION.DEFAULT_LIMIT;
    const currentPage = Number(page) || PAGINATION.DEFAULT_PAGE;
    const skip = (currentPage - 1) * limit;

    const [payments, total] = await Promise.all([
      prisma.purchasePayment.findMany({
        where: { storeId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          supplierId: true,
          purchaseId: true,
          amount: true,
          paymentMethod: true,
          createdAt: true,
          supplier: {
            select: {
              name: true,
              address: true,
              email: true,
              phone: true,
            },
          },
        },
      }),
      prisma.purchasePayment.count({ where: { storeId } }),
    ]);

    return sendResponse(res, 200, true, 'Payments fetched successfully', {
      payments,
      totalPage: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * Returns all payments for a supplier
 *-----------------------------------------*/
export const getSupplierPayments = async (
  req: Request<{ supplierId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId!;
    const { supplierId } = req.params;

    const payments = await prisma.purchasePayment.findMany({
      where: { storeId, supplierId },
      orderBy: { createdAt: 'desc' },
    });

    return sendResponse(res, 200, true, 'Payments fetched successfully', {
      payments,
    });
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * Returns all payments for a purchase
 *-----------------------------------------*/
export const getPurchasePayments = async (
  req: Request<{ purchaseId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId!;
    const { purchaseId } = req.params;

    const payments = await prisma.purchasePayment.findMany({
      where: { storeId, purchaseId },
      orderBy: { createdAt: 'desc' },
    });

    return sendResponse(res, 200, true, 'Payments fetched successfully', {
      payments,
    });
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * records a payment against a purchase and
 * updates its paid amount in one transaction.
 *-----------------------------------------*/
export const ReceivePurchasePayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId!;
    const { purchaseId, amount, paymentMethod } =
      ReceivedPurchasePaymentSchema.parse(req.body);

    const purchase = await prisma.purchase.findUnique({
      where: { storeId_id: { storeId, id: purchaseId } },
      select: {
        id: true,
        supplierId: true,
        total: true,
        paid: true,
      },
    });

    if (!purchase) {
      throw new ApiError(404, 'Purchase not found');
    }
    const paymentAmount = new Prisma.Decimal(amount);
    const newPaid = purchase.paid.plus(paymentAmount);
    if (newPaid.greaterThan(purchase.total)) {
      throw new ApiError(400, 'Payment exceeds purchase total.');
    }

    await prisma.$transaction(async tx => {
      await tx.purchasePayment.create({
        data: {
          storeId,
          supplierId: purchase.supplierId,
          purchaseId,
          amount: paymentAmount,
          paymentMethod,
        },
      });

      await tx.purchase.update({
        where: { storeId_id: { storeId, id: purchaseId } },
        data: { paid: newPaid },
      });
    });

    emitToStore(storeId, 'payment_purchase:updated');
    return sendResponse(res, 201, true, 'Payment received successfully');
  } catch (error) {
    next(error);
  }
};
