import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/db.js';
import ApiError from '../helpers/apiError.js';
import sendResponse from '../helpers/sendResponse.js';
import { ReceivedSalePaymentSchema } from '../validations/payment.validation.js';
import { emitToStore } from '../helpers/socket/socket.js';
import { Prisma } from '../generated/prisma/client.js';
import { PAGINATION } from '../constants/index.js';

/*-----------------------------------------*
 * Returns all customer payments
 *-----------------------------------------*/
export const getAllCustomerPayments = async (
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
      prisma.salePayment.findMany({
        where: { storeId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          customerId: true,
          saleId: true,
          amount: true,
          paymentMethod: true,
          createdAt: true,
          customer: {
            select: {
              name: true,
              address: true,
              email: true,
              phone: true,
            },
          },
        },
      }),
      prisma.salePayment.count({ where: { storeId } }),
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
 * Returns all payments for a customer
 *-----------------------------------------*/
export const getCustomerPayments = async (
  req: Request<{ customerId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId!;
    const { customerId } = req.params;

    const payments = await prisma.salePayment.findMany({
      where: { storeId, customerId },
      orderBy: { createdAt: 'desc' },
    });

    return sendResponse(
      res,
      200,
      true,
      'Payments fetched successfully',
      payments,
    );
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * Returns all payments for a sale
 *-----------------------------------------*/
export const getSalePayments = async (
  req: Request<{ saleId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId!;
    const { saleId } = req.params;

    const payments = await prisma.salePayment.findMany({
      where: { storeId, saleId },
      orderBy: { createdAt: 'desc' },
    });

    return sendResponse(
      res,
      200,
      true,
      'Payments fetched successfully',
      payments,
    );
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * records a payment against a sale and
 * updates its paid amount in one transaction.
 *-----------------------------------------*/
export const ReceiveSalePayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId!;
    const { saleId, amount, paymentMethod } = ReceivedSalePaymentSchema.parse(
      req.body,
    );

    const sale = await prisma.sale.findUnique({
      where: { storeId_id: { storeId, id: saleId } },
      select: {
        id: true,
        customerId: true,
        total: true,
        paid: true,
      },
    });

    if (!sale) {
      throw new ApiError(404, 'sale not found');
    }
    const paymentAmount = new Prisma.Decimal(amount);
    const newPaid = sale.paid.plus(paymentAmount);
    if (newPaid.greaterThan(sale.total)) {
      throw new ApiError(400, 'Payment exceeds sale total.');
    }

    await prisma.$transaction(async tx => {
      await tx.salePayment.create({
        data: {
          storeId,
          customerId: sale.customerId,
          saleId,
          amount: paymentAmount,
          paymentMethod,
        },
      });

      await tx.sale.update({
        where: { storeId_id: { storeId, id: saleId } },
        data: { paid: newPaid },
      });
    });

    emitToStore(storeId, 'payment_sale:updated');
    return sendResponse(res, 201, true, 'Payment received successfully');
  } catch (error) {
    next(error);
  }
};
