import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

const jsonError = (message: string) => ({
  success: false,
  message,
});

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: jsonError('Too many requests, please try again later'),
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
  message: jsonError('Too many email requests, try again after 1 hour'),
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: jsonError('Too many login attempts, try again after 15 minutes'),
});

export const passwordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: jsonError('Too many password reset requests, try again later'),
});
