import type { Request, Response, NextFunction } from 'express';
import ApiError from '../helpers/apiError.js';
import httpStatus from 'http-status';
import config from '../config/config.js';
import { ZodError } from 'zod';
import { Prisma } from '../generated/prisma/client.js';

export const errorConverter = (
  err: unknown,
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  let error = err;

  // Prisma validation error
  if (error instanceof Prisma.PrismaClientValidationError) {
    error = new ApiError(
      httpStatus.BAD_REQUEST,
      'Invalid request data',
      true,
      error.stack,
    );
  }

  // Prisma known request error
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        error = new ApiError(
          httpStatus.CONFLICT,
          'A record with this value already exists',
          true,
          error.stack,
        );
        break;

      case 'P2025':
        error = new ApiError(
          httpStatus.NOT_FOUND,
          'Requested record was not found',
          true,
          error.stack,
        );
        break;

      case 'P2003':
        error = new ApiError(
          httpStatus.BAD_REQUEST,
          'Invalid related record',
          true,
          error.stack,
        );
        break;

      default:
        error = new ApiError(
          httpStatus.BAD_REQUEST,
          'Database request failed',
          true,
          error.stack,
        );
    }
  }

  // Zod validation error
  if (error instanceof ZodError) {
    const message = error.issues.map(issue => issue.message).join(', ');
    error = new ApiError(httpStatus.BAD_REQUEST, message, true, error.stack);
  }

  // Unknown / unexpected error
  if (!(error instanceof ApiError)) {
    const statusCode =
      error instanceof Error
        ? httpStatus.INTERNAL_SERVER_ERROR
        : httpStatus.BAD_REQUEST;

    const message =
      error instanceof Error ? error.message : 'Something went wrong';
    const stack = error instanceof Error ? error.stack : undefined;
    error = new ApiError(statusCode, message, false, stack);
  }

  next(error);
};

export const errorHandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let { statusCode, message } = err;

  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = 'Internal Server Error';
  }

  if (config.env === 'development') {
    console.log('DevError:', err);
    console.log('DevError Message:', err.message);
    console.log('DevError Stack:', err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.env === 'development' && {
      stack: err.stack,
    }),
  });
};
