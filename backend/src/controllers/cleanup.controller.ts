import { prisma } from '../db/db.js';
import sendResponse from '../helpers/sendResponse.js';
import type { NextFunction, Request, Response } from 'express';

/*-----------------------------------------*
 * cleans up expired temporary data  removes
 * temp signup records and password reset
 * records whose otp has already expired
 *-----------------------------------------*/
export const cleanupAndHealth = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const now = new Date();
    await prisma.tempUser.deleteMany({
      where: { otpExpiresAt: { lt: now } },
    });
    await prisma.tempForgotPassData.deleteMany({
      where: { otpExpiresAt: { lt: now } },
    });

    res.status(200).json({
      status: 'ok',
      message: 'Health check passed & cleanup done',
    });
  } catch (err) {
    next(err);
  }
};
