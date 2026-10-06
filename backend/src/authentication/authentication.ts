import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import ApiError from '../helpers/apiError.js';
import config from '../config/config.js';
import type { AuthPayload, StorePayload } from '../types/auth.types.js';
import { COOKIE_NAMES } from '../constants/index.js';

const authentication = (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.cookies[COOKIE_NAMES.AUTH];

  if (!authToken) {
    throw new ApiError(401, 'Access denied!');
  }

  try {
    const jwtSecret = config.jwt.secret;

    const authPayload = jwt.verify(authToken, jwtSecret) as AuthPayload;
    res.locals.userId = authPayload.userId;

    const storeToken = req.cookies[COOKIE_NAMES.STORE];
    if (storeToken) {
      const storePayload = jwt.verify(storeToken, jwtSecret) as StorePayload;

      if (
        storePayload.userId !== authPayload.userId ||
        !storePayload.storeId ||
        !storePayload.role
      ) {
        throw new ApiError(401, 'Invalid token!');
      }

      res.locals.storeId = storePayload.storeId;
      res.locals.role = storePayload.role;
    }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, 'Token expired!');
    }
    throw new ApiError(401, 'Invalid token!');
  }

  next();
};

export default authentication;
