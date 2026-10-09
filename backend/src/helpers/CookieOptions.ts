import type { CookieOptions } from 'express';
import config from '../config/config.js';

// export const buildCookieOptions = (maxAgeMs: number): CookieOptions => ({
//   httpOnly: true,
//   secure: config.cookie.isProd,
//   sameSite: config.cookie.sameSite,
//   maxAge: maxAgeMs,
//   ...(config.cookie.domain ? { domain: config.cookie.domain } : {}),
// });



export const buildCookieOptions = (
  maxAgeMs: number,
): CookieOptions => ({
  httpOnly: true,
  secure: config.cookie.isProd,
  sameSite: config.cookie.sameSite,
  maxAge: maxAgeMs,
  path: '/',
  ...(config.cookie.domain
    ? { domain: config.cookie.domain }
    : {}),
});

export const clearCookieOptions = (): CookieOptions => {
  const { maxAge: _maxAge, ...rest } = buildCookieOptions(0);
  return rest;
};