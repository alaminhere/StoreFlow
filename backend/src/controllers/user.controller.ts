import { prisma } from '../db/db.js';
import ApiError from '../helpers/apiError.js';
import sendResponse from '../helpers/sendResponse.js';
import type { Request, Response, NextFunction } from 'express';
import { COOKIE_NAMES } from '../constants/index.js';
import { emitToUser } from '../helpers/socket/socket.js';
import { clearCookieOptions } from '../helpers/CookieOptions.js';
import { comparePassword, hashPassword } from '../helpers/password.js';
import {
  updatePasswordSchema,
  updateProfileSchema,
} from '../validations/user.validation.js';

/*-----------------------------------------*
 * returns the currently signed in user
 * profile along with the stores they belong
 * to and their role in each store
 *-----------------------------------------*/
export const getCurrentUser = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.userId;
    const storeId = res.locals.storeId;

    const [user, memberships, allStores] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
        },
      }),
      prisma.storeMember.findMany({
        where: { userId },
        select: { storeId: true, role: true },
      }),
      prisma.store.findMany({
        where: { members: { some: { userId } } },
        select: { id: true, name: true, email: true },
      }),
    ]);

    if (!user) {
      throw new ApiError(404, 'User Not Found!');
    }

    const storeMap = new Map(allStores.map(s => [s.id, s]));
    const stores = memberships.flatMap(m => {
      const store = storeMap.get(m.storeId);
      if (!store) return [];

      return [
        {
          id: store.id,
          name: store.name,
          email: store.email,
          role: m.role,
        },
      ];
    });

    const currentStore = storeId
      ? (stores.find(s => s.id === storeId) ?? null)
      : null;

    return sendResponse(res, 200, true, 'User fetched successfully', {
      ...user,
      currentStore,
      stores,
    });
  } catch (error) {
    next(error);
  }
};
/*-----------------------------------------*
 * looks up a user by email and returns
 * their basic profile info
 *-----------------------------------------*/
export const userByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.query as { email: string };
    if (!email) {
      throw new ApiError(400, 'Email is required');
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });
    if (!user) {
      throw new ApiError(404, 'User Not Found!');
    }

    return sendResponse(res, 200, true, 'User fetched successfully', user);
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * updates the signed in user own profile
 * with the submitted fields
 *-----------------------------------------*/
export const updateMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = updateProfileSchema.parse(req.body);
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    );

    const userId = res.locals.userId;
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateData,
    });

    const storeId = res.locals.storeId;
    emitToUser(storeId!, 'user:updated');

    return sendResponse(res, 200, true, 'User profile updated successfully');
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * changes the signed in user password
 * after confirming the current one
 *-----------------------------------------*/
export const updateMyPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { currentPassword, newPassword } = updatePasswordSchema.parse(
      req.body,
    );

    const userId = res.locals.userId;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      throw new ApiError(404, 'User not found!');
    }

    const isPasswordValid = await comparePassword(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ApiError(400, 'Current password is incorrect!');
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: await hashPassword(newPassword),
      },
    });

    emitToUser(userId!, 'user:updated');

    return sendResponse(res, 200, true, 'Password updated successfully');
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * deletes the signed in user account
 * blocked if they still own a store
 *-----------------------------------------*/
export const deleteMyAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.userId;
    const { password } = req.body;

    if (!password || typeof password !== 'string') {
      throw new ApiError(400, 'Password is required to delete your account.');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new ApiError(400, 'Incorrect password.');
    }

    const ownerStore = await prisma.storeMember.findFirst({
      where: { userId, role: 'OWNER' },
    });

    if (ownerStore) {
      throw new ApiError(
        400,
        'You are an owner of a store. Please delete your store before deleting your account.',
      );
    }

    await prisma.user.delete({ where: { id: userId } });

    res.clearCookie(COOKIE_NAMES.STORE, clearCookieOptions());
    res.clearCookie(COOKIE_NAMES.AUTH, clearCookieOptions());

    return sendResponse(res, 200, true, 'User account deleted successfully');
  } catch (error) {
    next(error);
  }
};
