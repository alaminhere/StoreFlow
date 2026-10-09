import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/db.js';
import ApiError from '../helpers/apiError.js';
import { createSlug } from '../helpers/slugify.js';
import { getNextId } from '../helpers/getNextId.js';
import sendResponse from '../helpers/sendResponse.js';
import { Prisma } from '../generated/prisma/client.js';
import { emitToStore } from '../helpers/socket/socket.js';
import { ID_PREFIX, PAGINATION } from '../constants/index.js';
import {
  createCategorySchema,
  deleteCategorySchema,
} from '../validations/categoryValidation.js';

/*-----------------------------------------*
 * Returns a paginated list of categories for
 * the current store, with optional search by name
 *-----------------------------------------*/
export const getAllCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId!;
    const { search, page } = req.query;

    const limit = PAGINATION.DEFAULT_LIMIT;
    const currentPage = Number(page) || PAGINATION.DEFAULT_PAGE;

    const filter: Prisma.CategoryWhereInput = {
      storeId,
      deletedAt: null,
    };

    if (search) {
      filter.name = {
        contains: String(search).trim(),
      };
    }

    const skip = (currentPage - 1) * limit;
    const [categories, totalCategories] = await Promise.all([
      prisma.category.findMany({
        where: filter,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.count({
        where: filter,
      }),
    ]);

    const totalPage = Math.ceil(totalCategories / limit);
    return sendResponse(res, 200, true, 'Categories fetched successfully', {
      categories,
      totalPage,
    });
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * returns a lightweight list of categories for
 * the current store, useful for dropdowns
 *-----------------------------------------*/
export const categoryList = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId;
    const categories = await prisma.category.findMany({
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

    return sendResponse(
      res,
      200,
      true,
      'Category list fetched successfully',
      categories,
    );
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * creates a category, or restores it if a
 * soft deleted category with the same name
 * already exists
 *-----------------------------------------*/
export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = createCategorySchema.parse(req.body);
    const storeId = res.locals.storeId!;
    const slug = createSlug(name);

    // active category check
    const existsCategory = await prisma.category.findFirst({
      where: {
        storeId,
        name,
        deletedAt: null,
      },
    });

    if (existsCategory) {
      throw new ApiError(409, `Category "${name}" already exists.`);
    }

    // soft deleted category check  => restore
    const deletedCategory = await prisma.category.findFirst({
      where: {
        storeId,
        name,
        deletedAt: { not: null },
      },
    });

    if (deletedCategory) {
      await prisma.category.update({
        where: { storeId_id: { storeId, id: deletedCategory.id } },
        data: { deletedAt: null, slug },
      });

      emitToStore(storeId, 'category:updated');
      return sendResponse(
        res,
        200,
        true,
        'Category restored with its previous products. Delete it first if you want to use a different name.',
      );
    }

    // create new category
    await prisma.category.create({
      data: {
        id: await getNextId(storeId, ID_PREFIX.CATEGORY),
        name,
        slug,
        storeId,
      },
    });

    emitToStore(storeId, 'category:updated');
    return sendResponse(res, 201, true, 'Category created successfully');
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * updates a category's name and slug for the
 * current store
 *-----------------------------------------*/
export const updateCategory = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { name } = createCategorySchema.parse(req.body);
    const storeId = res.locals.storeId!;
    const slug = createSlug(name);

    // duplicate name check
    const nameConflict = await prisma.category.findFirst({
      where: {
        storeId,
        name,
        deletedAt: null,
        NOT: { id },
      },
    });

    if (nameConflict) {
      throw new ApiError(409, `Category "${name}" already exists.`);
    }

    await prisma.category.update({
      where: { storeId_id: { storeId, id } },
      data: { name, slug },
    });

    emitToStore(storeId, 'category:updated');
    return sendResponse(res, 200, true, 'Category updated successfully');
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * soft deletes one or more categories for the
 * current store, blocked if any category still
 * has active products
 *-----------------------------------------*/
export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { ids } = deleteCategorySchema.parse(req.body);
    const storeId = res.locals.storeId!;

    for (const categoryId of ids) {
      const category = await prisma.category.findFirst({
        where: { storeId, id: categoryId, deletedAt: null },
      });

      if (!category) {
        throw new ApiError(404, 'Category not found.');
      }

      const existsProducts = await prisma.product.count({
        where: { storeId, categoryId, deletedAt: null },
      });

      if (existsProducts > 0) {
        throw new ApiError(
          400,
          `Cannot delete '${category.name}'. It has active products.`,
        );
      }
    }

    // soft delete
    const result = await prisma.category.updateMany({
      where: {
        storeId,
        id: { in: ids },
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });

    if (result.count === 0) {
      throw new ApiError(404, 'No categories found to delete');
    }

    emitToStore(storeId, 'category:updated');
    return sendResponse(
      res,
      200,
      true,
      `${result.count} ${result.count > 1 ? 'categories' : 'category'} deleted successfully`,
    );
  } catch (error) {
    next(error);
  }
};
