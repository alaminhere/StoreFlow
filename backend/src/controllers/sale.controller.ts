import { prisma } from '../db/db.js';
import ApiError from '../helpers/apiError.js';
import { getNextId } from '../helpers/getNextId.js';
import sendResponse from '../helpers/sendResponse.js';
import { emitToStore } from '../helpers/socket/socket.js';
import type { Prisma } from '../generated/prisma/client.js';
import type { Request, Response, NextFunction } from 'express';
import { computeIsLowStock } from '../helpers/computeIsLowStock.js';
import { createSaleSchema } from '../validations/sale.validation.js';
import { ID_PREFIX, MOVEMENT_TYPES, PAGINATION } from '../constants/index.js';

/*-----------------------------------------*
 * returns a paginated list of sales for the
 * current store, with optional search by
 * sale id or customer name.
 *-----------------------------------------*/
export const getAllSale = async (
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

    const filter: Prisma.SaleWhereInput = { storeId };
    if (search) {
      const term = String(search).trim();
      filter.OR = [
        { id: { contains: term } },
        { customer: { name: { contains: term } } },
      ];
    }

    const [sales, totalSales] = await Promise.all([
      prisma.sale.findMany({
        where: filter,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          customer: {
            select: { id: true, name: true, email: true, phone: true },
          },
          items: true,
        },
      }),
      prisma.sale.count({ where: filter }),
    ]);

    const formatted = sales.map(sale => ({
      id: sale.id,
      customerId: sale.customerId,
      customer: sale.customer,
      subtotal: Number(sale.subtotal),
      discount: Number(sale.discount),
      total: Number(sale.total),
      paid: Number(sale.paid),
      due: Number(sale.total) - Number(sale.paid),
      paymentMethod: sale.paymentMethod,
      items: sale.items.map(item => ({
        id: item.id,
        saleId: item.saleId,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: Number(item.price),
        total: Number(item.total),
      })),
      createdAt: sale.createdAt,
      updatedAt: sale.updatedAt,
    }));

    const totalPage = Math.ceil(totalSales / limit);
    return sendResponse(res, 200, true, 'Sales fetched successfully', {
      sales: formatted,
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
export const getSaleForReturn = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId!;
    const { id } = req.params;
    if (!id) throw new ApiError(400, 'Sale ID is required');

    const sale = await prisma.sale.findFirst({
      where: { storeId, id },
      include: {
        customer: {
          select: { name: true, phone: true },
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

    if (!sale) throw new ApiError(404, 'Sale not found');

    const returnedItems = await prisma.returnItem.groupBy({
      by: ['productId'],
      where: {
        storeId,
        return: { referenceId: id, type: 'SALE_RETURN' },
      },
      _sum: { quantity: true },
    });

    const returnedMap = new Map(
      returnedItems.map(r => [r.productId, r._sum.quantity ?? 0]),
    );

    const itemsWithReturnable = sale.items.map(item => {
      const alreadyReturned = returnedMap.get(item.productId) ?? 0;
      const returnable = item.quantity - alreadyReturned;

      return {
        ...item,
        alreadyReturned,
        returnable,
      };
    });

    return sendResponse(res, 200, true, 'Sale fetched successfully', {
      id: sale.id,
      party: {
        name: sale.customer?.name,
        phone: sale.customer?.phone,
      },
      total: sale.total,
      paid: sale.paid,
      due: sale.total.minus(sale.paid),
      createdAt: sale.createdAt,
      items: itemsWithReturnable,
    });
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * creates a sale with its line items,
 * decrements product stock, and logs stock
 * movements — all inside one transaction.
 *-----------------------------------------*/
export const createSale = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId!;
    const data = createSaleSchema.parse(req.body);
    const productIds = data.items.map(i => i.productId);

    const [customer, products, saleId] = await Promise.all([
      prisma.customer.findFirst({
        where: { storeId, id: data.customerId },
        select: { id: true, name: true, email: true, phone: true },
      }),
      prisma.product.findMany({
        where: { storeId, id: { in: productIds }, deletedAt: null },
        select: {
          id: true,
          name: true,
          sellingPrice: true,
          stock: true,
          minimumStockLevel: true,
        },
      }),
      getNextId(storeId, ID_PREFIX.SALE),
    ]);

    if (!customer) throw new ApiError(404, 'Customer not found');
    const productMap = new Map(products.map(p => [p.id, p]));

    for (const item of data.items) {
      const p = productMap.get(item.productId);
      if (!p) throw new ApiError(404, `Product ${item.productId} not found`);
      if (p.stock < item.quantity) {
        throw new ApiError(400, `Insufficient stock for ${p.name}`);
      }
      if (Number(p.sellingPrice) !== item.price) {
        throw new ApiError(400, `Price mismatch for ${p.name}`);
      }
    }

    const saleItems = data.items.map(item => ({
      storeId,
      saleId,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: item.price,
      total: item.total,
    }));

    const createdSale = await prisma.$transaction(async tx => {
      for (const item of data.items) {
        const p = productMap.get(item.productId)!;

        const updated = await tx.product.updateMany({
          where: {
            storeId,
            id: item.productId,
            deletedAt: null,
            stock: { gte: item.quantity },
          },
          data: {
            stock: { decrement: item.quantity },
            isLowStock: computeIsLowStock(
              p.stock - item.quantity,
              p.minimumStockLevel,
            ),
          },
        });

        if (updated.count === 0) {
          throw new ApiError(400, `Insufficient stock for ${p.name}`);
        }
      }

      const sale = await tx.sale.create({
        data: {
          id: saleId,
          storeId,
          customerId: data.customerId,
          subtotal: data.subtotal,
          discount: data.discount,
          total: data.total,
          paid: data.paid,
          paymentMethod: data.paymentMethod,
        },
      });

      await tx.saleItem.createMany({ data: saleItems });

      await tx.stockMovement.createMany({
        data: data.items.map(item => {
          const before = productMap.get(item.productId)!.stock;
          return {
            storeId,
            productId: item.productId,
            type: MOVEMENT_TYPES.SALE,
            beforeStock: before,
            afterStock: before - item.quantity,
            saleId,
          };
        }),
      });

      return sale;
    });

    const result = {
      ...createdSale,
      customer,
      items: saleItems.map(i => ({
        ...i,
        price: Number(i.price),
        total: Number(i.total),
      })),
      subtotal: Number(createdSale.subtotal),
      discount: Number(createdSale.discount),
      total: Number(createdSale.total),
      paid: Number(createdSale.paid),
      due: Number(createdSale.total) - Number(createdSale.paid),
    };

    emitToStore(storeId, 'sale:updated');
    return sendResponse(res, 201, true, 'Sale created successfully', result);
  } catch (error) {
    next(error);
  }
};
