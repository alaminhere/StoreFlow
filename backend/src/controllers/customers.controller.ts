import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/db.js';
import ApiError from '../helpers/apiError.js';
import { getNextId } from '../helpers/getNextId.js';
import sendResponse from '../helpers/sendResponse.js';
import { Prisma } from '../generated/prisma/client.js';
import { emitToStore } from '../helpers/socket/socket.js';
import { ID_PREFIX, PAGINATION } from '../constants/index.js';
import {
  createCustomerSchema,
  deleteCustomerSchema,
} from '../validations/customerValidation.js';

/*-----------------------------------------*
 * Returns a paginated list of customers for
 * the current store, with optional search by name
 *-----------------------------------------*/
export const getAllCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId!;
    const { search, page } = req.query;

    const limit = PAGINATION.DEFAULT_LIMIT;
    const currentPage = Number(page) || PAGINATION.DEFAULT_PAGE;

    const filter: Prisma.CustomerWhereInput = {
      storeId,
      deletedAt: null,
    };

    if (search) {
      filter.name = { contains: String(search).trim() };
    }

    const skip = (currentPage - 1) * limit;

    const [customers, totalCustomers] = await Promise.all([
      prisma.customer.findMany({
        where: filter,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          address: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.customer.count({ where: filter }),
    ]);

    const customerIds = customers.map(c => c.id);
    const salesAgg = await prisma.sale.groupBy({
      by: ['customerId'],
      where: {
        storeId,
        customerId: { in: customerIds },
      },
      _sum: {
        total: true,
        paid: true,
      },
    });

    // build a map
    const salesMap = new Map(
      salesAgg.map(s => [
        s.customerId,
        {
          totalSale: Number(s._sum.total ?? 0),
          totalPaid: Number(s._sum.paid ?? 0),
        },
      ]),
    );
    const formattedCustomers = customers.map(customer => {
      const agg = salesMap.get(customer.id) || {
        totalSale: 0,
        totalPaid: 0,
      };
      return {
        ...customer,
        totalSale: agg.totalSale,
        totalPaid: agg.totalPaid,
        totalDue: agg.totalSale - agg.totalPaid,
      };
    });

    const totalPage = Math.ceil(totalCustomers / limit);
    return sendResponse(res, 200, true, 'Customers fetched successfully', {
      customers: formattedCustomers,
      totalPage,
    });
  } catch (error) {
    next(error);
  }
};
/*-----------------------------------------*
 * Returns a lightweight list of customers for
 * the current store, useful for dropdowns
 *-----------------------------------------*/
export const customersList = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId;
    const customers = await prisma.customer.findMany({
      where: {
        storeId: storeId!,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return sendResponse(
      res,
      200,
      true,
      'Customers list fetched successfully',
      customers,
    );
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * Creates a customer or restores it if a
 * soft-deleted customer with the same phone
 * already exists
 *-----------------------------------------*/
export const createCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, phone, email, address } = createCustomerSchema.parse(
      req.body,
    );

    const storeId = res.locals.storeId!;
    // active customer check
    const existsCustomer = await prisma.customer.findFirst({
      where: {
        storeId,
        phone,
        deletedAt: null,
      },
    });

    if (existsCustomer) {
      throw new ApiError(409, `Customer with phone '${phone}' already exists.`);
    }

    // soft-deleted customer check => restore
    const deletedCustomer = await prisma.customer.findFirst({
      where: {
        storeId,
        phone,
        deletedAt: { not: null },
      },
    });

    if (deletedCustomer) {
      await prisma.customer.update({
        where: { storeId_id: { storeId, id: deletedCustomer.id } },
        data: {
          deletedAt: null,
          name,
          email,
          address,
        },
      });

      emitToStore(storeId, 'customer:updated');
      return sendResponse(
        res,
        200,
        true,
        'Customer restored with previous sales history. Delete it first if you want to use a different phone.',
      );
    }

    // create new customer
    await prisma.customer.create({
      data: {
        id: await getNextId(storeId, ID_PREFIX.CUSTOMER),
        name,
        phone,
        email,
        address,
        storeId,
      },
    });

    emitToStore(storeId, 'customer:updated');
    return sendResponse(res, 201, true, 'Customer created successfully');
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * Updates a customer details for the
 * current store
 *-----------------------------------------*/
export const updateCustomer = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { name, phone, email, address } = createCustomerSchema.parse(
      req.body,
    );
    const storeId = res.locals.storeId!;

    // duplicate phone check
    const phoneConflict = await prisma.customer.findFirst({
      where: {
        storeId,
        phone,
        deletedAt: null,
        NOT: { id },
      },
    });

    if (phoneConflict) {
      throw new ApiError(409, `Customer with phone '${phone}' already exists.`);
    }

    await prisma.customer.update({
      where: { storeId_id: { storeId, id } },
      data: {
        name,
        phone,
        email,
        address,
      },
    });

    emitToStore(storeId, 'customer:updated');
    return sendResponse(res, 200, true, 'Customer updated successfully');
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * Soft deletes one or more customer for the
 * current store. Sales history is preserved
 *-----------------------------------------*/
export const deleteCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { ids } = deleteCustomerSchema.parse(req.body);
    const storeId = res.locals.storeId!;

    for (const customerId of ids) {
      const customer = await prisma.customer.findFirst({
        where: { storeId, id: customerId, deletedAt: null },
      });

      if (!customer) {
        throw new ApiError(404, 'Customer not found.');
      }
    }

    // soft delete
    const result = await prisma.customer.updateMany({
      where: {
        storeId,
        id: { in: ids },
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });

    if (result.count === 0) {
      throw new ApiError(404, 'No customer found to delete');
    }

    emitToStore(storeId, 'customer:updated');

    return sendResponse(
      res,
      200,
      true,
      `${result.count} ${result.count > 1 ? 'customers' : 'customer'} deleted successfully`,
    );
  } catch (error) {
    next(error);
  }
};
