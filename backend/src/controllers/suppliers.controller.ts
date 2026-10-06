import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/db.js';
import ApiError from '../helpers/apiError.js';
import { getNextId } from '../helpers/getNextId.js';
import sendResponse from '../helpers/sendResponse.js';
import { Prisma } from '../generated/prisma/client.js';
import { emitToStore } from '../helpers/socket/socket.js';
import { ID_PREFIX, PAGINATION } from '../constants/index.js';
import {
  createSupplierSchema,
  deleteSupplierSchema,
} from '../validations/suppliersValidation.js';

/*-----------------------------------------*
 * Returns a paginated list of suppliers for
 * the current store, with optional search by name
 *-----------------------------------------*/
export const getAllSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId ?? '';
    const { search, page } = req.query;

    const limit = PAGINATION.DEFAULT_LIMIT;
    const currentPage = Number(page) || PAGINATION.DEFAULT_PAGE;

    const filter: Prisma.SupplierWhereInput = {
      storeId,
      deletedAt: null,
    };

    if (search) {
      filter.name = { contains: String(search).trim() };
    }

    const skip = (currentPage - 1) * limit;
    const [suppliers, totalSuppliers] = await Promise.all([
      prisma.supplier.findMany({
        where: filter,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          shopName: true,
          phone: true,
          email: true,
          address: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.supplier.count({ where: filter }),
    ]);

    //   all supplier ids
    const supplierIds = suppliers.map(s => s.id);

    // aggregate purchases per supplier
    const purchasesAgg = await prisma.purchase.groupBy({
      by: ['supplierId'],
      where: {
        supplierId: { in: supplierIds },
        storeId,
      },
      _sum: {
        total: true,
        paid: true,
      },
    });

    const purchaseMap = new Map(
      purchasesAgg.map(p => [
        p.supplierId,
        {
          totalPurchase: Number(p._sum.total),
          totalPaid: Number(p._sum.paid),
        },
      ]),
    );

    // Merge purchases with suppliers
    const formattedSuppliers = suppliers.map(supplier => {
      const agg = purchaseMap.get(supplier.id) || {
        totalPurchase: 0,
        totalPaid: 0,
      };
      return {
        ...supplier,
        totalSale: agg.totalPurchase,
        totalPaid: agg.totalPaid,
        totalDue: agg.totalPurchase - agg.totalPaid,
      };
    });

    const totalPage = Math.ceil(totalSuppliers / limit);

    return sendResponse(res, 200, true, 'Suppliers fetched successfully', {
      suppliers: formattedSuppliers,
      totalPage,
    });
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * Returns a lightweight list of suppliers for
 * the current store, useful for dropdowns
 *-----------------------------------------*/
export const suppliersList = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId;

    const suppliers = await prisma.supplier.findMany({
      where: {
        storeId: storeId!,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return sendResponse(
      res,
      200,
      true,
      'Suppliers list fetched successfully',
      suppliers,
    );
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * Creates a supplier, or restores it if a
 * soft-deleted supplier with the same phone
 * already exists
 *-----------------------------------------*/
export const createSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, shopName, phone, email, address } =
      createSupplierSchema.parse(req.body);
    const storeId = res.locals.storeId ?? '';

    // active supplier
    const existsSupplier = await prisma.supplier.findFirst({
      where: {
        storeId,
        phone,
        deletedAt: null,
      },
    });

    if (existsSupplier) {
      throw new ApiError(409, `Supplier with phone '${phone}' already exists.`);
    }

    // soft-deleted supplier check  => restore
    const deletedSupplier = await prisma.supplier.findFirst({
      where: {
        storeId,
        phone,
        deletedAt: { not: null },
      },
    });

    if (deletedSupplier) {
      await prisma.supplier.update({
        where: { storeId_id: { storeId, id: deletedSupplier.id } },
        data: {
          deletedAt: null,
          name,
          shopName,
          email,
          address,
        },
      });

      emitToStore(storeId, 'supplier:updated');
      return sendResponse(
        res,
        200,
        true,
        'Supplier restored with previous purchase history. Delete it first if you want to use a different phone.',
      );
    }

    // Create new supplier
    await prisma.supplier.create({
      data: {
        id: await getNextId(storeId, ID_PREFIX.SUPPLIER),
        name,
        shopName,
        phone,
        email,
        address,
        storeId,
      },
    });

    emitToStore(storeId, 'supplier:updated');
    return sendResponse(res, 201, true, 'Supplier created successfully');
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * Updates a supplier's details for the
 * current store
 *-----------------------------------------*/
export const updateSupplier = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { name, shopName, phone, email, address } =
      createSupplierSchema.parse(req.body);
    const storeId = res.locals.storeId ?? '';

    // duplicate phone check
    const phoneConflict = await prisma.supplier.findFirst({
      where: {
        storeId,
        phone,
        deletedAt: null,
        NOT: { id },
      },
    });

    if (phoneConflict) {
      throw new ApiError(409, `Supplier with phone '${phone}' already exists.`);
    }

    await prisma.supplier.update({
      where: { storeId_id: { storeId, id } },
      data: {
        name,
        shopName,
        phone,
        email,
        address,
      },
    });

    emitToStore(storeId, 'supplier:updated');
    return sendResponse(res, 200, true, 'Supplier updated successfully');
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * Soft deletes one or more suppliers for the
 * current store. Purchase history is preserved
 *-----------------------------------------*/
export const deleteSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { ids } = deleteSupplierSchema.parse(req.body);
    const storeId = res.locals.storeId ?? '';

    for (const supplierId of ids) {
      const supplier = await prisma.supplier.findFirst({
        where: { storeId, id: supplierId, deletedAt: null },
      });

      if (!supplier) {
        throw new ApiError(404, 'Supplier not found.');
      }
    }

    // soft delete
    const result = await prisma.supplier.updateMany({
      where: {
        storeId,
        id: { in: ids },
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });

    if (result.count === 0) {
      throw new ApiError(404, 'No supplier found to delete');
    }

    emitToStore(storeId, 'supplier:updated');

    return sendResponse(
      res,
      200,
      true,
      `${result.count} ${result.count > 1 ? 'suppliers' : 'supplier'} deleted successfully`,
    );
  } catch (error) {
    next(error);
  }
};
