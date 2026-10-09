import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

const jsonError = (message: string) => ({
  success: false,
  message,
});

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5000,
  standardHeaders: true,
  legacyHeaders: false,
  message: jsonError('Too many requests, please try again after 15 minutes'),
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: jsonError(
    'Too many login attempts, please try again after 15 minutes',
  ),
});

export const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    const userId = res.locals?.userId;
    return userId ? `user:${userId}` : ipKeyGenerator(req.ip ?? '');
  },
  message: jsonError('Too many email requests, please try again after 1 hour'),
});

export const passwordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: jsonError(
    'Too many password reset requests, please try again after 1 hour',
  ),
});
