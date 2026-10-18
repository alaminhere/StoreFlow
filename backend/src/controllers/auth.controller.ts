import jwt from 'jsonwebtoken';
import { prisma } from '../db/db.js';
import ApiError from '../helpers/apiError.js';
import type { Request, Response, NextFunction } from 'express';
import {
  signupSchema,
  otpSchema,
  signinSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validations/auth.validation.js';
import sendVerificationEmail from '../helpers/email/resend.js';
import config from '../config/config.js';
import { COOKIE_NAMES, VERIFICATION } from '../constants/index.js';
import {
  buildCookieOptions,
  clearCookieOptions,
} from '../helpers/CookieOptions.js';
import sendResponse from '../helpers/sendResponse.js';
import { comparePassword, hashPassword } from '../helpers/password.js';

/*-----------------------------------------*
 * handles user signup with email otp
 * verification
 *-----------------------------------------*/
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, phone, password } = signupSchema.parse(req.body);

    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      throw new ApiError(409, 'Email already exists');
    }

    const otp = Math.floor(Math.random() * 900000 + 100000).toString();
    const otpExpiresAt = new Date(
      Date.now() + VERIFICATION.CODE_EXPIRES_SECONDS * 1000,
    );

    const payload = {
      name: name,
      phone: phone,
      password: await hashPassword(password),
      otp,
      otpExpiresAt,
    };

    await prisma.tempUser.upsert({
      where: {
        email,
      },
      update: payload,
      create: { ...payload, email: email },
    });
    await sendVerificationEmail(otp, email);

    const token = jwt.sign({ email: email }, config.jwt.secret, {
      expiresIn: VERIFICATION.CODE_EXPIRES_SECONDS,
    });

    res.cookie(
      COOKIE_NAMES.VERIFY,
      token,
      buildCookieOptions(VERIFICATION.CODE_EXPIRES_SECONDS * 1000),
    );
    return sendResponse(res, 201, true, 'Verification code sent to your email');
  } catch (err) {
    next(err);
  }
};

/*-----------------------------------------*
 * verifies the otp sent to the user email,
 * creates the real user account, and
 * auto log in
 *-----------------------------------------*/
export const verifySignup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies[COOKIE_NAMES.VERIFY];
    const { otp } = otpSchema.parse(req.body);

    if (!token) {
      throw new ApiError(401, 'Session expire!! try again.');
    }

    const jwtSecret = config.jwt.secret;
    const payload = jwt.verify(token, jwtSecret) as { email: string };
    const email = payload.email;

    const tempUser = await prisma.tempUser.findFirst({
      where: { email },
    });

    if (!tempUser) {
      throw new ApiError(404, 'User Not Found!');
    }
    if (tempUser.otpExpiresAt.getTime() <= Date.now()) {
      throw new ApiError(401, 'OTP expired! Please sign up again.');
    }
    if (tempUser.otp !== otp) {
      throw new ApiError(400, 'OTP does not match');
    }

    const user = await prisma.$transaction(async tx => {
      const createUser = await tx.user.create({
        data: {
          name: tempUser.name,
          email: tempUser.email,
          phone: tempUser.phone,
          password: tempUser.password,
        },
      });
      await tx.tempUser.delete({
        where: { email },
      });

      return createUser;
    });

    const expirationSeconds = config.jwt.accessExpirationSeconds;
    const auth_token = jwt.sign({ userId: user.id }, config.jwt.secret, {
      expiresIn: expirationSeconds,
    });

    res.cookie(
      COOKIE_NAMES.AUTH,
      auth_token,
      buildCookieOptions(expirationSeconds * 1000),
    );
    res.clearCookie(COOKIE_NAMES.VERIFY, clearCookieOptions());
    return sendResponse(res, 201, true, 'Email verified successfully');
  } catch (err) {
    next(err);
  }
};

/*-----------------------------------------*
 * signs in an existing user with email
 * or password, and set the auth cookie
 *-----------------------------------------*/
export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = signinSchema.parse(req.body);
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new ApiError(404, 'User Not Found!');
    }

    const compare = await comparePassword(password, user.password);
    if (!compare) {
      throw new ApiError(400, 'Password does not match');
    }

    const expirationSeconds = config.jwt.accessExpirationSeconds;
    const auth_token = jwt.sign({ userId: user.id }, config.jwt.secret, {
      expiresIn: expirationSeconds,
    });

    res.cookie(
      COOKIE_NAMES.AUTH,
      auth_token,
      buildCookieOptions(expirationSeconds * 1000),
    );
    return sendResponse(res, 200, true, 'Signed in successfully');
  } catch (err) {
    next(err);
  }
};

/*-----------------------------------------*
 * forgot password flow => sends  an otp
 * to the user email and stores a temporary
 * reset record.
 *-----------------------------------------*/
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new ApiError(404, 'User Not Found!');
    }

    const otp = Math.floor(Math.random() * 900000 + 100000).toString();
    const otpExpiresAt = new Date(
      Date.now() + VERIFICATION.CODE_EXPIRES_SECONDS * 1000,
    );
    const payload = {
      isVerified: false,
      otp,
      otpExpiresAt,
    };

    await prisma.tempForgotPassData.upsert({
      where: {
        email,
      },
      update: payload,
      create: { ...payload, email },
    });
    await sendVerificationEmail(otp, email);

    const token = jwt.sign({ email: email }, config.jwt.secret, {
      expiresIn: VERIFICATION.CODE_EXPIRES_SECONDS,
    });

    res.cookie(
      COOKIE_NAMES.FORGOT,
      token,
      buildCookieOptions(VERIFICATION.CODE_EXPIRES_SECONDS * 1000),
    );
    return sendResponse(
      res,
      200,
      true,
      'Password reset code sent to your email',
    );
  } catch (err) {
    next(err);
  }
};

/*-----------------------------------------*
 * verifies the otp sent for password reset
 * and marks the request as verified so the
 * user can set a new password
 *-----------------------------------------*/
export const verifyForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies[COOKIE_NAMES.FORGOT];
    const { otp } = otpSchema.parse(req.body);
    if (!token) {
      throw new ApiError(401, 'Session expire!! try again.');
    }

    const jwtSecret = config.jwt.secret;
    const payload = jwt.verify(token, jwtSecret) as { email: string };
    const email = payload.email;

    const exists = await prisma.tempForgotPassData.findUnique({
      where: { email },
    });

    if (!exists) {
      throw new ApiError(404, 'User Not Found!');
    }
    if (exists.otpExpiresAt.getTime() <= Date.now()) {
      throw new ApiError(401, 'OTP expired! Please sign up again.');
    }
    if (exists.otp !== otp) {
      throw new ApiError(400, 'OTP does not match');
    }

    await prisma.tempForgotPassData.update({
      where: { email },
      data: {
        isVerified: true,
      },
    });

    return sendResponse(
      res,
      200,
      true,
      'Verification successful. You can now reset your password',
    );
  } catch (err) {
    next(err);
  }
};

/*-----------------------------------------*
 * resets the user password after the otp
 * has been verified, then cleans up the
 * temporary reset record
 *-----------------------------------------*/
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies[COOKIE_NAMES.FORGOT];
    if (!token) {
      throw new ApiError(401, 'Session expire!! try again.');
    }

    const { password } = resetPasswordSchema.parse(req.body);
    const jwtSecret = config.jwt.secret;
    const payload = jwt.verify(token, jwtSecret) as { email: string };
    const email = payload.email;

    const exists = await prisma.tempForgotPassData.findUnique({
      where: { email },
    });

    if (!exists) {
      throw new ApiError(404, 'User Not Found!');
    }
    if (!exists.isVerified) {
      throw new ApiError(400, 'User not verified');
    }

    await prisma.$transaction(async tx => {
      await tx.user.update({
        where: { email },
        data: {
          password: await hashPassword(password),
        },
      });

      await prisma.tempForgotPassData.delete({
        where: { email },
      });
    });

    res.clearCookie(COOKIE_NAMES.FORGOT, clearCookieOptions());
    return sendResponse(res, 200, true, 'Password reset successfully');
  } catch (err) {
    next(err);
  }
};

/*-----------------------------------------*
 * signs the user out by clearing the auth
 * and store cookies.
 *-----------------------------------------*/
export const signout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.clearCookie(COOKIE_NAMES.STORE, clearCookieOptions());
    res.clearCookie(COOKIE_NAMES.AUTH, clearCookieOptions());
    return sendResponse(res, 200, true, 'Signed out successfully');
  } catch (err) {
    next(err);
  }
};
