import type { Request, Response, NextFunction } from 'express';

import { prisma } from '../db/db.js';
import dayjs from '../config/dayjs.js';
import sendResponse from '../helpers/sendResponse.js';
import type { RangeKey } from '../constants/index.js';
import { getDateRange } from '../helpers/dateRange.js';
import percentChange from '../helpers/percentChange.js';
import { months, sumByMonth } from '../helpers/monthlyAggregation.js';

/*-----------------------------------------*
 * builds the dashboard overview — sales,
 * purchases, revenue, category split, and
 * payment method breakdown for the last six
 * months
 *-----------------------------------------*/
export const getDashboardOverview = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId!;
    const now = dayjs().tz();
    const sixMonthsAgo = now.subtract(5, 'month').startOf('month').toDate();

    // last 6 months data
    const [sales, purchases, salePayments] = await Promise.all([
      prisma.sale.findMany({
        where: { storeId, createdAt: { gte: sixMonthsAgo } },
        select: { total: true, createdAt: true },
      }),
      prisma.purchase.findMany({
        where: { storeId, createdAt: { gte: sixMonthsAgo } },
        select: { total: true, createdAt: true },
      }),
      prisma.salePayment.findMany({
        where: { storeId, createdAt: { gte: sixMonthsAgo } },
        select: { amount: true, createdAt: true },
      }),
    ]);

    const salesByMonth = sumByMonth(sales, 'total');
    const purchasesByMonth = sumByMonth(purchases, 'total');
    const revenueByMonth = sumByMonth(salePayments, 'amount');

    //payment methods
    const paymentGroups = await prisma.salePayment.groupBy({
      by: ['paymentMethod'],
      where: { storeId },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
    });

    const paymentMethods = paymentGroups.map(p => ({
      label: p.paymentMethod,
      value: Number(p._sum.amount ?? 0),
    }));

    //top 4 categories
    const topCategories = await prisma.$queryRaw<
      Array<{ name: string; total: bigint }>
    >`
      SELECT c.name, SUM(si.total) AS total
      FROM SaleItem si
      JOIN Product p ON p.id = si.productId AND p.storeId = si.storeId
      JOIN Category c ON c.id = p.categoryId AND c.storeId = p.storeId
      WHERE si.storeId = ${storeId}
      GROUP BY c.name
      ORDER BY total DESC
      LIMIT 4
    `;
    const topTotal = topCategories.reduce((s, c) => s + Number(c.total), 0);

    const salesByCategory = topCategories.map(c => ({
      label: c.name,
      value: topTotal
        ? Number(((Number(c.total) * 100) / topTotal).toFixed(1))
        : 0,
    }));

    return sendResponse(res, 200, true, 'Dashboard data fetched', {
      labels: months.map(m => m.label),
      sales: salesByMonth,
      purchases: purchasesByMonth,
      revenue: revenueByMonth,
      salesByCategory,
      paymentMethods,
    });
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * returns the dashboard stat cards — sales,
 * purchases, profit, and store counts for
 * the selected range, with change vs the
 * previous period
 *-----------------------------------------*/
export const getDashboardCards = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId!;
    const data = req.params;
    const range = (data.range as RangeKey) || 'today';
    const { from, to, prevFrom, prevTo } = getDateRange(range);

    const currentFilter = { gte: from, lte: to };
    const previousFilter = { gte: prevFrom, lte: prevTo };

    // query
    const [
      salesAgg,
      purchasesAgg,
      prevSalesAgg,
      prevPurchasesAgg,
      totalProducts,
      lowStock,
      outOfStock,
      totalCustomers,
      totalSuppliers,
      stockValueRows,
    ] = await Promise.all([
      prisma.sale.aggregate({
        where: { storeId, createdAt: currentFilter },
        _sum: { total: true },
      }),
      prisma.purchase.aggregate({
        where: { storeId, createdAt: currentFilter },
        _sum: { total: true },
      }),
      prisma.sale.aggregate({
        where: { storeId, createdAt: previousFilter },
        _sum: { total: true },
      }),
      prisma.purchase.aggregate({
        where: { storeId, createdAt: previousFilter },
        _sum: { total: true },
      }),
      prisma.product.count({ where: { storeId, deletedAt: null } }),
      prisma.product.count({
        where: { storeId, deletedAt: null, isLowStock: true },
      }),
      prisma.product.count({
        where: { storeId, deletedAt: null, stock: 0 },
      }),
      prisma.customer.count({ where: { storeId, deletedAt: null } }),
      prisma.supplier.count({ where: { storeId, deletedAt: null } }),
      prisma.$queryRaw<Array<{ value: string | null }>>`
        SELECT SUM(price * stock) AS value
        FROM Product
        WHERE storeId = ${storeId} AND deletedAt IS NULL
      `,
    ]);

    const totalSales = Number(salesAgg._sum.total ?? 0);
    const totalPurchases = Number(purchasesAgg._sum.total ?? 0);
    const prevTotalSales = Number(prevSalesAgg._sum.total ?? 0);
    const prevTotalPurchases = Number(prevPurchasesAgg._sum.total ?? 0);
    const stockValue = Number(stockValueRows[0]?.value ?? 0);

    const grossProfit = totalSales - totalPurchases;
    const prevGrossProfit = prevTotalSales - prevTotalPurchases;

    return sendResponse(res, 200, true, 'Dashboard cards fetched', {
      range,
      cards: {
        totalSales: {
          value: totalSales,
          change: percentChange(totalSales, prevTotalSales),
        },
        totalPurchases: {
          value: totalPurchases,
          change: percentChange(totalPurchases, prevTotalPurchases),
        },
        grossProfit: {
          value: grossProfit,
          change: percentChange(grossProfit, prevGrossProfit),
        },
        netProfit: {
          value: grossProfit,
          change: percentChange(grossProfit, prevGrossProfit),
        },
      },
      stats: {
        totalProducts,
        stockValue,
        lowStock,
        outOfStock,
        totalCustomers,
        totalSuppliers,
      },
    });
  } catch (error) {
    next(error);
  }
};
