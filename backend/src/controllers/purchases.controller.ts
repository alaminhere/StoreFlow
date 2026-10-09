import { prisma } from '../db/db.js';
import ApiError from '../helpers/apiError.js';
import { getNextId } from '../helpers/getNextId.js';
import sendResponse from '../helpers/sendResponse.js';
import { emitToStore } from '../helpers/socket/socket.js';
import { Prisma } from '../generated/prisma/client.js';
import type { Request, Response, NextFunction } from 'express';
import { computeIsLowStock } from '../helpers/computeIsLowStock.js';
import { ID_PREFIX, MOVEMENT_TYPES, PAGINATION } from '../constants/index.js';
import { createPurchaseSchema } from '../validations/purchases.validation.js';

/*-----------------------------------------*
 * returns a paginated list of purchases for
 * the current store, with optional search by
 * purchase id or supplier name.
 *-----------------------------------------*/
export const getAllPurchases = async (
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

    const filter: Prisma.PurchaseWhereInput = { storeId };
    if (search) {
      const term = String(search).trim();
      filter.OR = [
        { id: { contains: term } },
        { supplier: { name: { contains: term } } },
      ];
    }

    const [purchase, totalPurchase] = await Promise.all([
      prisma.purchase.findMany({
        where: filter,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          supplier: {
            select: {
              id: true,
              name: true,
              shopName: true,
              email: true,
              phone: true,
            },
          },
          items: true,
        },
      }),
      prisma.purchase.count({ where: filter }),
    ]);

    const formatted = purchase.map(purchase => ({
      id: purchase.id,
      supplierId: purchase.supplierId,
      supplier: purchase.supplier,
      subtotal: Number(purchase.subtotal),
      discount: Number(purchase.discount),
      total: Number(purchase.total),
      paid: Number(purchase.paid),
      due: Number(purchase.total) - Number(purchase.paid),
      paymentMethod: purchase.paymentMethod,
      items: purchase.items.map(item => ({
        id: item.id,
        purchaseId: item.purchaseId,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: Number(item.price),
        total: Number(item.total),
      })),
      createdAt: purchase.createdAt,
      updatedAt: purchase.updatedAt,
    }));

    const totalPage = Math.ceil(totalPurchase / limit);
    return sendResponse(res, 200, true, 'Purchase fetched successfully', {
      purchase: formatted,
      totalPage,
    });
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * returns a single sale with its customer
 * and line items for the current store.
 *-----------------------------------------*/
export const getPurchaseForReturn = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId!;
    const { id } = req.params;
    if (!id) throw new ApiError(400, 'Purchases ID is required');

    const purchases = await prisma.purchase.findFirst({
      where: { storeId, id },
      include: {
        supplier: {
          select: { id: true, name: true, phone: true, email: true },
        },
        items: {
          select: {
            id: true,
            productId: true,
            productName: true,
            quantity: true,
            price: true,
          },
        },
      },
    });
    if (!purchases) throw new ApiError(404, 'Purchases not found');

    const returnedItems = await prisma.returnItem.groupBy({
      by: ['productId'],
      where: {
        storeId,
        return: { referenceId: id, type: 'PURCHASE_RETURN' },
      },
      _sum: { quantity: true },
    });

    const returnedMap = new Map(
      returnedItems.map(r => [r.productId, r._sum.quantity ?? 0]),
    );

    const itemsWithReturnable = purchases.items.map(item => {
      const alreadyReturned = returnedMap.get(item.productId) ?? 0;
      const returnable = item.quantity - alreadyReturned;

      return {
        ...item,
        alreadyReturned,
        returnable,
      };
    });

    return sendResponse(res, 200, true, 'Purchases fetched successfully', {
      id: purchases.id,
      party: {
        name: purchases.supplier?.name,
        phone: purchases.supplier?.phone,
      },

      total: purchases.total,
      paid: purchases.paid,
      due: purchases.total.minus(purchases.paid),
      createdAt: purchases.createdAt,
      items: itemsWithReturnable,
    });
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * creates a purchase with its line items,
 * increments product stock, and logs stock
 * movements — all inside one transaction.
 *-----------------------------------------*/
export const createPurchases = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId!;
    const data = createPurchaseSchema.parse(req.body);
    const productIds = data.items.map(i => i.productId);

    const [supplier, products, purchaseId] = await Promise.all([
      prisma.supplier.findFirst({
        where: { storeId, id: data.supplierId },
        select: { id: true },
      }),
      prisma.product.findMany({
        where: { storeId, id: { in: productIds }, deletedAt: null },
        select: {
          id: true,
          name: true,
          stock: true,
          minimumStockLevel: true,
        },
      }),
      getNextId(storeId, ID_PREFIX.PURCHASE),
    ]);

    if (!supplier) throw new ApiError(404, 'Supplier not found');
    const productMap = new Map(products.map(p => [p.id, p]));

    for (const item of data.items) {
      if (!productMap.has(item.productId)) {
        throw new ApiError(404, `Product ${item.productId} not found`);
      }
    }

    const purchaseItems = data.items.map(item => ({
      storeId,
      purchaseId,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: item.price,
      total: item.total,
    }));

    await prisma.$transaction(async tx => {
      for (const item of data.items) {
        const p = productMap.get(item.productId)!;

        const updated = await tx.product.updateMany({
          where: { storeId, id: item.productId, deletedAt: null },
          data: {
            stock: { increment: item.quantity },
            price: new Prisma.Decimal(item.price),
            isLowStock: computeIsLowStock(
              p.stock + item.quantity,
              p.minimumStockLevel,
            ),
          },
        });

        if (updated.count === 0) {
          throw new ApiError(404, `Product ${p.name} not found`);
        }
      }

      await tx.purchase.create({
        data: {
          id: purchaseId,
          storeId,
          dueDate: data.dueDate,
          supplierId: data.supplierId,
          subtotal: data.subtotal,
          discount: data.discount,
          total: data.total,
          paid: data.paid,
          paymentMethod: data.paymentMethod,
        },
      });

      await tx.purchaseItem.createMany({ data: purchaseItems });

      await tx.stockMovement.createMany({
        data: data.items.map(item => {
          const before = productMap.get(item.productId)!.stock;
          return {
            storeId,
            productId: item.productId,
            type: MOVEMENT_TYPES.PURCHASE,
            beforeStock: before,
            afterStock: before + item.quantity,
            purchaseId,
          };
        }),
      });

      const uniqueProductIds = [...new Set(productIds)];
      await tx.productSupplier.createMany({
        data: uniqueProductIds.map(productId => ({
          storeId,
          productId,
          supplierId: data.supplierId,
        })),
        skipDuplicates: true,
      });
    });

    emitToStore(storeId, 'purchase:updated');
    return sendResponse(res, 201, true, 'Purchase created successfully');
  } catch (error) {
    next(error);
  }
};
