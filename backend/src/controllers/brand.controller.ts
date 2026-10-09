import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/db.js';
import { ID_PREFIX, PAGINATION } from '../constants/index.js';
import { Prisma } from '../generated/prisma/client.js';
import sendResponse from '../helpers/sendResponse.js';
import {
  createBrandSchema,
  deleteBrandSchema,
} from '../validations/brandValidation.js';
import { createSlug } from '../helpers/slugify.js';
import { getNextId } from '../helpers/getNextId.js';
import { emitToStore } from '../helpers/socket/socket.js';
import ApiError from '../helpers/apiError.js';

/*-----------------------------------------*
 * returns a paginated list of brands for the
 * current store, with optional search by name
 *-----------------------------------------*/

export const getAllBrand = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId!;
    const { search, page } = req.query;

    const limit = PAGINATION.DEFAULT_LIMIT;
    const currentPage = Number(page) || PAGINATION.DEFAULT_PAGE;

    const filter: Prisma.BrandWhereInput = {
      storeId,
    };

    if (search) {
      filter.name = {
        contains: String(search).trim(),
      };
    }

    const skip = (currentPage - 1) * limit;
    const [brands, totalBrands] = await Promise.all([
      prisma.brand.findMany({
        where: {
          ...filter,
          deletedAt: null,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.brand.count({
        where: {
          ...filter,
          deletedAt: null,
        },
      }),
    ]);

    const totalPage = Math.ceil(totalBrands / limit);
    const data = {
      brands,
      totalPage,
    };

    return sendResponse(res, 200, true, 'Brands fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * returns a lightweight list of brands for
 * the current store, useful for dropdowns
 *-----------------------------------------*/
export const brandList = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId!;

    const brands = await prisma.brand.findMany({
      where: {
        storeId: storeId!,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });
    if (!brands) {
      throw new ApiError(404, 'Brand Not Found');
    }

    return sendResponse(
      res,
      200,
      true,
      'Brand list fetched successfully',
      brands,
    );
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * creates a brand, or restores it if a
 * soft-deleted brand with the same name
 * already exists.
 *-----------------------------------------*/
export const createBrand = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = createBrandSchema.parse(req.body);
    const storeId = res.locals.storeId!;
    const slug = createSlug(name);

    // active  check
    const existsBrand = await prisma.brand.findFirst({
      where: {
        storeId,
        name,
        deletedAt: null,
      },
    });

    if (existsBrand) {
      throw new ApiError(409, `Brand "${name}" already exists.`);
    }

    // deleted brand => Restore
    const deletedBrand = await prisma.brand.findFirst({
      where: {
        storeId,
        name,
        deletedAt: { not: null },
      },
    });

    if (deletedBrand) {
      await prisma.brand.update({
        where: { storeId_id: { storeId, id: deletedBrand.id } },
        data: { deletedAt: null, slug },
      });

      emitToStore(storeId, 'brand:updated');
      return sendResponse(
        res,
        200,
        true,
        'Brand restored with its previous products. Delete it first if you want to use a different name.',
      );
    }

    // ৩. Create
    await prisma.brand.create({
      data: {
        id: await getNextId(storeId, ID_PREFIX.BRAND),
        name,
        slug,
        storeId,
      },
    });
    emitToStore(storeId, 'brand:updated');
    return sendResponse(res, 201, true, 'Brand created successfully');
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * updates a brand's name and slug for the
 * current store.
 *-----------------------------------------*/
export const updateBrand = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { name } = createBrandSchema.parse(req.body);
    const storeId = res.locals.storeId!;
    const slug = createSlug(name);

    const nameConflict = await prisma.brand.findFirst({
      where: {
        storeId,
        name,
        deletedAt: null,
        NOT: { id },
      },
    });

    if (nameConflict) {
      throw new ApiError(409, `Brand "${name}" already exists.`);
    }

    await prisma.brand.update({
      where: { storeId_id: { storeId, id } },
      data: { name, slug },
    });

    emitToStore(storeId, 'brand:updated');
    return sendResponse(res, 200, true, 'Brand updated successfully');
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * soft deletes one or more brands for the
 * current store blocked if any brand still
 * has active products
 *-----------------------------------------*/
export const deleteBrand = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { ids } = deleteBrandSchema.parse(req.body);
    const storeId = res.locals.storeId!;

    for (const brandId of ids) {
      const brand = await prisma.brand.findFirst({
        where: { storeId, id: brandId, deletedAt: null },
      });

      if (!brand) {
        throw new ApiError(404, `Brand not found.`);
      }

      const existsProducts = await prisma.product.count({
        where: { storeId, brandId, deletedAt: null },
      });

      if (existsProducts > 0) {
        throw new ApiError(
          400,
          `Cannot delete brand '${brand.name}'. ${existsProducts} active products exist. Delete products first.`,
        );
      }
    }

    // soft delete
    const result = await prisma.brand.updateMany({
      where: {
        storeId,
        id: { in: ids },
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });

    if (result.count === 0) {
      throw new ApiError(404, 'No brands found to delete');
    }

    emitToStore(storeId, 'brand:updated');
    return sendResponse(
      res,
      200,
      true,
      `${result.count} ${result.count > 1 ? 'brands' : 'brand'} deleted successfully`,
    );
  } catch (error) {
    next(error);
  }
};
