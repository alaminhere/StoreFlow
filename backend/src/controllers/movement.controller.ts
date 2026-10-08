import { prisma } from '../db/db.js';
import ApiError from '../helpers/apiError.js';
import { PAGINATION } from '../constants/index.js';
import sendResponse from '../helpers/sendResponse.js';
import { emitToStore } from '../helpers/socket/socket.js';
import type { Request, Response, NextFunction } from 'express';
import { createMovementSchema } from '../validations/movement.validation.js';
import { StockMovementType, type Prisma } from '../generated/prisma/client.js';

/*-----------------------------------------*
 * manually adjusts a product's stock — adds
 * or removes units — and logs the movement.
 *-----------------------------------------*/
export const createStockMovement = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId!;
    const { productId, quantity, type, reason } = createMovementSchema.parse(
      req.body,
    );

    const product = await prisma.product.findFirst({
      where: { storeId, id: productId, deletedAt: null },
      select: { id: true, stock: true, name: true },
    });

    if (!product) throw new ApiError(404, 'Product not found');

    const beforeStock = product.stock;
    const afterStock =
      'STOCK_IN' === type ? beforeStock + quantity : beforeStock - quantity;

    if (afterStock < 0) {
      throw new ApiError(400, `Insufficient stock. Available: ${beforeStock}`);
    }

    await prisma.$transaction([
      prisma.product.update({
        where: { storeId_id: { storeId, id: productId } },
        data: { stock: afterStock },
      }),
      prisma.stockMovement.create({
        data: {
          storeId,
          productId,
          type,
          reason: reason || null,
          beforeStock,
          afterStock,
        },
      }),
    ]);

    emitToStore(storeId, 'stockMovement:updated');
    return sendResponse(res, 201, true, 'Stock adjusted successfully');
  } catch (error) {
    next(error);
  }
};
/*-----------------------------------------*
 * Returns a paginated list of stock movements
 * for the current store, with search by reason
 * or date (YYYY-MM-DD)
 *-----------------------------------------*/
export const getAllStockMovement = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId!;
    const { search, page } = req.query;

    const limit = PAGINATION.DEFAULT_LIMIT;
    const currentPage = Number(page) || PAGINATION.DEFAULT_PAGE;
    const skip = (currentPage - 1) * limit;

    const filter: Prisma.StockMovementWhereInput = { storeId };

    if (search) {
      const term = String(search).trim();
      if (term) {
        const upperTerm = term.toUpperCase();
        const allTypes = Object.values(StockMovementType);
        const matchedTypes = allTypes.filter(t => t.includes(upperTerm));

        if (matchedTypes.length > 0) {
          filter.OR = [
            { reason: { contains: term } },
            { type: { in: matchedTypes } },
          ];
        } else {
          filter.reason = { contains: term };
        }
      }
    }

    const [movements, totalMovements] = await Promise.all([
      prisma.stockMovement.findMany({
        where: filter,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          type: true,
          reason: true,
          beforeStock: true,
          afterStock: true,
          purchaseId: true,
          productId: true,
          saleId: true,
          createdAt: true,
        },
      }),
      prisma.stockMovement.count({ where: filter }),
    ]);

    const totalPage = Math.ceil(totalMovements / limit);
    const data = {
      movements,
      totalPage,
    };

    return sendResponse(res, 200, true, 'Movements fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * Returns all stock movements for a product
 *-----------------------------------------*/
export const getStockMovementsByProductId = async (
  req: Request<{ productId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId!;
    const { productId } = req.params;

    const movements = await prisma.stockMovement.findMany({
      where: { storeId, productId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        type: true,
        reason: true,
        beforeStock: true,
        afterStock: true,
        purchaseId: true,
        productId: true,
        saleId: true,
        createdAt: true,
      },
    });

    return sendResponse(
      res,
      200,
      true,
      'Movements fetched successfully',
      movements,
    );
  } catch (error) {
    next(error);
  }
};
