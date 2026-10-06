import type { Request, Response, NextFunction } from 'express';
import ApiError from '../helpers/apiError.js';
import httpStatus from 'http-status';

const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, `Not Found ${req.originalUrl}`));
};
export default notFound