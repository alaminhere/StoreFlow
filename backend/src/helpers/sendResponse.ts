import type { Response } from 'express';
import { Prisma } from '../generated/prisma/client.js';

// converts prisma.decimal → number
const convertDecimal = (value: unknown): unknown => {
  if (value === null || value === undefined) return value;

  if (value instanceof Prisma.Decimal) return value.toNumber();
  if (typeof value !== 'object') return value;
  if (value instanceof Date) return value;
  if (Array.isArray(value)) return value.map(convertDecimal);
  return Object.fromEntries(
    Object.entries(value).map(([key, val]) => [key, convertDecimal(val)]),
  );
};

const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T,
) => {
  return res.status(statusCode).json({
    success,
    message,
    ...(data !== undefined && {
      data: convertDecimal(data),
    }),
  });
};

export default sendResponse;
