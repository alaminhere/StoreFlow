import { prisma } from '../db/db.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import ApiError from '../helpers/apiError.js';
import { getNextId } from '../helpers/getNextId.js';
import sendResponse from '../helpers/sendResponse.js';
import { emitToStore } from '../helpers/socket/socket.js';
import type { StorePayload } from '../types/auth.types.js';
import { COOKIE_NAMES, ID_PREFIX } from '../constants/index.js';
import type { Request, Response, NextFunction } from 'express';
import { deleteCloudinaryImage } from '../helpers/cloudinary/deleteCloudinaryImage.js';
import {
  buildCookieOptions,
  clearCookieOptions,
} from '../helpers/CookieOptions.js';
import {
  createStoreSchema,
  openStoreSchema,
  storeUpdateSchema,
} from '../validations/store.validation.js';

/*-----------------------------------------*
 * returns the current store details
 * along with its members
 *-----------------------------------------*/
export const currentStore = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.userId;
    const storeId = res.locals.storeId;

    if (!storeId) {
      return sendResponse(res, 200, true, 'No store selected');
    }
    const [store, member, user] = await Promise.all([
      prisma.store.findUnique({
        where: { id: storeId! },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          logo: true,
          tagline: true,
          address: true,
          invoiceFooterNote: true,
        },
      }),
      prisma.storeMember.findUnique({
        where: { storeId_userId: { storeId: storeId!, userId } },
        select: { id: true, userId: true, role: true },
      }),

      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, phone: true, email: true },
      }),
    ]);

    if (!store) {
      throw new ApiError(404, 'Store not found');
    }

    const MemberData =
      member && user
        ? {
            id: member.id,
            userId: member.userId,
            role: member.role,
            name: user.name,
            phone: user.phone,
            email: user.email,
          }
        : null;

    const result = {
      ...store,
      currentMember: MemberData,
    };

    return sendResponse(res, 200, true, 'Store fetched successfully', result);
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * creates a new store and makes the signed
 * in user the owner
 *-----------------------------------------*/
export const createStore = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, phone, logo, address, tagline } =
      createStoreSchema.parse(req.body);
    const exists = await prisma.store.findUnique({
      where: { email },
    });
    if (exists) {
      throw new ApiError(409, 'A store already exists with this email');
    }

    const userId = res.locals.userId;

    const store = await prisma.$transaction(async tx => {
      const createStore = await tx.store.create({
        data: {
          name,
          email,
          phone,
          logo,
          address,
          tagline,
        },
      });

      await tx.storeMember.create({
        data: {
          id: await getNextId(createStore.id, ID_PREFIX.MEMBER, tx),
          storeId: createStore.id,
          userId: userId,
          role: 'OWNER',
        },
      });

      return createStore;
    });

    const expirationSeconds = config.jwt.accessExpirationSeconds;
    const initialToken: StorePayload = {
      role: 'OWNER',
      storeId: store.id,
      userId,
    };
    const store_token = jwt.sign(initialToken, config.jwt.secret, {
      expiresIn: expirationSeconds,
    });

    res.cookie(
      COOKIE_NAMES.STORE,
      store_token,
      buildCookieOptions(expirationSeconds * 1000),
    );
    return sendResponse(res, 201, true, 'Store created successfully', store);
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * updates the current store details and
 * cleans up the old logo if a new one was
 * uploaded
 *-----------------------------------------*/
export const UpdateCurrentStore = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    type Logo = {
      url: string;
      public_id: string;
    };

    const data = storeUpdateSchema.parse(req.body);
    const storeId = res.locals.storeId;

    // prev logo
    const oldLogo = data.logo
      ? await prisma.store.findUnique({
          where: { id: storeId! },
          select: { logo: true },
        })
      : null;

    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    );

    await prisma.store.update({
      where: { id: storeId! },
      data: updateData,
    });
    //  socket event
    emitToStore(storeId!, 'store:updated');

    if (data.logo && oldLogo?.logo) {
      const oldLogoData = oldLogo.logo as Logo;
      await deleteCloudinaryImage(oldLogoData.public_id);
    }

    return sendResponse(res, 200, true, 'Store updated successfully');
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * deletes the current store along with its
 * logo on cloudinary and clears the store
 * cookie
 *-----------------------------------------*/
// export const deleteCurrentStore = async (
//   _req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     type Logo = {
//       url: string;
//       public_id: string;
//     };

//     const storeId = res.locals.storeId;
//     const store = await prisma.store.findUnique({
//       where: {
//         id: storeId!,
//       },
//       select: {
//         logo: true,
//       },
//     });

//     await prisma.store.delete({
//       where: {
//         id: storeId!,
//       },
//     });
//     if (store?.logo) {
//       const logo = store.logo as Logo;
//       await deleteCloudinaryImage(logo.public_id);
//     }
//     res.clearCookie(COOKIE_NAMES.STORE, clearCookieOptions());

//     return sendResponse(res, 200, true, 'Store deleted successfully');
//   } catch (error) {
//     next(error);
//   }
// };

export const deleteCurrentStore = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    type Image = {
      url: string;
      public_id: string;
    };

    const storeId = res.locals.storeId!;
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: {
        logo: true,
        products: {
          select: { image: true },
        },
      },
    });

    if (!store) {
      return sendResponse(res, 404, false, 'Store not found');
    }

    const storeLogoPublicId = (store.logo as Image | null)?.public_id ?? null;
    const productPublicIds: string[] = store.products
      .map(p => (p.image as Image | null)?.public_id)
      .filter((id): id is string => !!id);

    await prisma.$transaction(
      async tx => {
        await tx.stockMovement.deleteMany({ where: { storeId } });

        await tx.returnItem.deleteMany({ where: { storeId } });
        await tx.return.deleteMany({ where: { storeId } });

        await tx.purchasePayment.deleteMany({ where: { storeId } });
        await tx.salePayment.deleteMany({ where: { storeId } });

        await tx.purchaseItem.deleteMany({ where: { storeId } });
        await tx.saleItem.deleteMany({ where: { storeId } });

        await tx.purchase.deleteMany({ where: { storeId } });
        await tx.sale.deleteMany({ where: { storeId } });

        await tx.productSupplier.deleteMany({ where: { storeId } });

        await tx.product.deleteMany({ where: { storeId } });

        await tx.brand.deleteMany({ where: { storeId } });
        await tx.category.deleteMany({ where: { storeId } });

        await tx.supplier.deleteMany({ where: { storeId } });
        await tx.customer.deleteMany({ where: { storeId } });

        await tx.storeMember.deleteMany({ where: { storeId } });
        await tx.counter.deleteMany({ where: { storeId } });

        await tx.store.delete({ where: { id: storeId } });
      },
      {
        timeout: 30_000,
        maxWait: 10_000,
      },
    );

    const cloudinaryDeletes: Promise<unknown>[] = productPublicIds.map(
      public_id => deleteCloudinaryImage(public_id),
    );
    if (storeLogoPublicId) {
      cloudinaryDeletes.push(deleteCloudinaryImage(storeLogoPublicId));
    }
    await Promise.allSettled(cloudinaryDeletes);

    res.clearCookie(COOKIE_NAMES.STORE, clearCookieOptions());
    return sendResponse(res, 200, true, 'Store deleted successfully');
  } catch (error) {
    next(error);
  }
};
/*-----------------------------------------*
 * opens a store the user is a member of by
 * issuing a fresh store token and swapping
 * the store cookie
 *-----------------------------------------*/
export const openStore = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.userId;
    const { storeId } = openStoreSchema.parse(req.body);

    const membership = await prisma.storeMember.findFirst({
      where: {
        userId,
        storeId,
      },
    });

    if (!membership) {
      throw new ApiError(403, 'You are not a member of this store');
    }
    const expirationSeconds = config.jwt.accessExpirationSeconds;

    const initialToken: StorePayload = {
      role: membership.role,
      storeId: membership.storeId,
      userId,
    };
    const store_token = jwt.sign(initialToken, config.jwt.secret, {
      expiresIn: expirationSeconds,
    });
    // already open store  cleared cookies
    res.clearCookie(COOKIE_NAMES.STORE, clearCookieOptions());

    // current store opening set cookies
    res.cookie(
      COOKIE_NAMES.STORE,
      store_token,
      buildCookieOptions(expirationSeconds * 1000),
    );
    return sendResponse(res, 201, true, 'Store opened successfully');
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * leaves the current store context by
 * clearing the store cookie.
 *-----------------------------------------*/
export const closedStore = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.clearCookie(COOKIE_NAMES.STORE, clearCookieOptions());
    return sendResponse(res, 200, true, 'Store context closed successfully');
  } catch (error) {
    next(error);
  }
};
