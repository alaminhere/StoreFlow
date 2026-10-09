import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/db.js';
import ApiError from '../helpers/apiError.js';
import sendResponse from '../helpers/sendResponse.js';
import { emitToStore } from '../helpers/socket/socket.js';
import { ID_PREFIX, PAGINATION } from '../constants/index.js';
import { getNextId } from '../helpers/getNextId.js';
import { Prisma, ReturnType } from '../generated/prisma/client.js';
import { createReturnSchema } from '../validations/return.validations.js';
import { computeIsLowStock } from '../helpers/computeIsLowStock.js';

/*-----------------------------------------*
 * creates a sale or purchase return, updates
 * stock when restocked, and logs movements
 * in one transaction.
 *-----------------------------------------*/
export const createReturn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId!;
    const data = createReturnSchema.parse(req.body);
    const isSale = data.type === 'SALE_RETURN';
    const productIds = data.items.map(i => i.productId);

    const [reference, products, newId] = await Promise.all([
      isSale
        ? prisma.sale.findUnique({
            where: { storeId_id: { storeId, id: data.referenceId } },
            select: {
              customerId: true,
              items: {
                select: {
                  productId: true,
                  productName: true,
                  quantity: true,
                  price: true,
                },
              },
            },
          })
        : prisma.purchase.findUnique({
            where: { storeId_id: { storeId, id: data.referenceId } },
            select: {
              supplierId: true,
              items: {
                select: {
                  productId: true,
                  productName: true,
                  quantity: true,
                  price: true,
                },
              },
            },
          }),
      prisma.product.findMany({
        where: { storeId, id: { in: productIds }, deletedAt: null },
        select: { id: true, name: true, stock: true, minimumStockLevel: true },
      }),
      getNextId(storeId, ID_PREFIX.RETURN),
    ]);

    if (!reference) {
      throw new ApiError(404, isSale ? 'Sale not found' : 'Purchase not found');
    }

    const returnedItems = await prisma.returnItem.groupBy({
      by: ['productId'],
      where: {
        storeId,
        return: {
          referenceId: data.referenceId,
          type: data.type,
        },
      },
      _sum: { quantity: true },
    });

    const returnedMap = new Map(
      returnedItems.map(r => [r.productId, r._sum.quantity ?? 0]),
    );

    const productMap = new Map(products.map(p => [p.id, p]));
    const originalItemsMap = new Map(
      reference.items.map(i => [
        i.productId,
        {
          quantity: i.quantity,
          price: i.price,
          productName: i.productName,
        },
      ]),
    );

    let refundAmount = new Prisma.Decimal(0);

    const returnItems = data.items.map(item => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new ApiError(404, `Product '${item.productId}' not found`);
      }

      const original = originalItemsMap.get(item.productId);
      if (!original) {
        throw new ApiError(
          400,
          `'${product.name}' is not in this ${isSale ? 'sale' : 'purchase'}`,
        );
      }

      const alreadyReturned = returnedMap.get(item.productId) ?? 0;
      const returnable = original.quantity - alreadyReturned;

      if (item.quantity > returnable) {
        throw new ApiError(
          400,
          `Cannot return ${item.quantity} of '${original.productName}'. Max: ${returnable}`,
        );
      }

      const total = original.price.mul(item.quantity);
      refundAmount = refundAmount.plus(total);

      return {
        storeId,
        returnId: newId,
        productId: item.productId,
        productName: original.productName,
        quantity: item.quantity,
        price: original.price,
        total,
      };
    });

    const customerId = 'customerId' in reference ? reference.customerId : null;
    const supplierId = 'supplierId' in reference ? reference.supplierId : null;

    const result = await prisma.$transaction(async tx => {
      await tx.return.create({
        data: {
          id: newId,
          storeId,
          type: data.type,
          referenceId: data.referenceId,
          customerId: customerId,
          supplierId: supplierId,
          reason: data.reason,
          refundAmount,
          condition: data.condition,
        },
      });

      await tx.returnItem.createMany({ data: returnItems });

      if (data.condition === 'RESTOCK') {
        const movements = [];

        for (const item of data.items) {
          const p = productMap.get(item.productId)!;

          const updated = await tx.product.updateMany({
            where: {
              storeId,
              id: item.productId,
              ...(isSale ? {} : { stock: { gte: item.quantity } }),
            },
            data: {
              stock: isSale
                ? { increment: item.quantity }
                : { decrement: item.quantity },
              isLowStock: computeIsLowStock(
                isSale ? p.stock + item.quantity : p.stock - item.quantity,
                p.minimumStockLevel,
              ),
            },
          });

          if (updated.count === 0) {
            throw new ApiError(400, `insufficient stock for '${p.name}'`);
          }

          movements.push({
            storeId,
            productId: item.productId,
            type: 'RETURN' as const,
            reason: data.reason,
            beforeStock: p.stock,
            afterStock: isSale
              ? p.stock + item.quantity
              : p.stock - item.quantity,
            returnId: newId,
          });
        }

        await tx.stockMovement.createMany({ data: movements });
      }

      return tx.return.findUniqueOrThrow({
        where: {
          id: newId,
          storeId,
        },
        select: {
          id: true,
          type: true,
          reason: true,
          condition: true,
          refundAmount: true,
          createdAt: true,

          items: {
            select: {
              id: true,
              productName: true,
              quantity: true,
              price: true,
              total: true,
            },
          },

          customer: isSale
            ? {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                  address: true,
                },
              }
            : false,

          supplier: !isSale
            ? {
                select: {
                  id: true,
                  name: true,
                  shopName: true,
                  phone: true,
                  email: true,
                  address: true,
                },
              }
            : false,
        },
      });
    });

    emitToStore(storeId, 'return:updated');
    return sendResponse(res, 201, true, 'Return created successfully', {
      id: result.id,
      type: isSale ? 'SALE_RETURN' : 'PURCHASE_RETURN',
      party: isSale ? result.customer : result.supplier,
      items: result.items,
      subtotal: Number(result.refundAmount),
      discount: 0,
      total: Number(result.refundAmount),
      paid: Number(result.refundAmount),
      due: 0,
      paymentMethod: 'CASH',
      createdAt: result.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * Returns paginated list of returns
 *-----------------------------------------*/
export const getAllReturns = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId!;
    const { page, party, search } = req.query;

    const limit = PAGINATION.DEFAULT_LIMIT;
    const currentPage = Number(page) || PAGINATION.DEFAULT_PAGE;
    const skip = (currentPage - 1) * limit;

    const filter: Prisma.ReturnWhereInput = { storeId };

    if (party === 'customer') {
      filter.customerId = { not: null };
    } else if (party === 'supplier') {
      filter.supplierId = { not: null };
    }
    if (search) {
      const term = String(search).trim();
      if (term) {
        const upperTerm = term.toUpperCase();
        const matchedTypes = Object.values(ReturnType).filter(t =>
          t.includes(upperTerm),
        );

        filter.OR = [
          { id: { contains: term } },
          { referenceId: { contains: term } },
          ...(matchedTypes.length > 0 ? [{ type: { in: matchedTypes } }] : []),
        ];
      }
    }

    const [returns, total] = await Promise.all([
      prisma.return.findMany({
        where: filter,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          type: true,
          reason: true,
          condition: true,
          refundAmount: true,
          createdAt: true,

          items: {
            select: {
              id: true,
              productName: true,
              quantity: true,
              price: true,
              total: true,
            },
          },

          customer: {
            select: {
              name: true,
              email: true,
              phone: true,
              address: true,
            },
          },
          supplier: {
            select: {
              name: true,
              shopName: true,
              phone: true,
              email: true,
              address: true,
            },
          },
        },
      }),
      prisma.return.count({ where: filter }),
    ]);

    const totalPage = Math.ceil(total / limit);

    const formattedReturns = returns.map(
      ({ refundAmount, supplier, customer, ...item }) => ({
        ...item,
        party: supplier || customer,
        subtotal: Number(refundAmount),
        discount: 0,
        total: Number(refundAmount),
        paid: Number(refundAmount),
        due: 0,
        paymentMethod: 'CASH',
      }),
    );

    return sendResponse(res, 200, true, 'Returns fetched successfully', {
      returns: formattedReturns,
      totalPage,
    });
  } catch (error) {
    next(error);
  }
};
