import { prisma } from '../db/db.js';
import sendResponse from '../helpers/sendResponse.js';
import type { NextFunction, Request, Response } from 'express';

/*-----------------------------------------*
 * cleans up expired temporary data  removes
 * temp signup records and password reset
 * records whose otp has already expired
 *-----------------------------------------*/
export const cleanupExpiredTempData = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const now = new Date();

    await prisma.tempUser.deleteMany({
      where: {
        otpExpiresAt: {
          lt: now,
        },
      },
    });

    await prisma.tempForgotPassData.deleteMany({
      where: {
        otpExpiresAt: {
          lt: now,
        },
      },
    });

    return sendResponse(
      res,
      200,
      true,
      'Expired temporary data cleaned successfully',
    );
  } catch (err) {
    next(err);
  }
};
