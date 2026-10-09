import { prisma } from '../db/db.js';
import ApiError from '../helpers/apiError.js';
import { createSlug } from '../helpers/slugify.js';
import { getNextId } from '../helpers/getNextId.js';
import sendResponse from '../helpers/sendResponse.js';
import { Prisma } from '../generated/prisma/client.js';
import { emitToStore } from '../helpers/socket/socket.js';
import { ID_PREFIX, PAGINATION } from '../constants/index.js';
import type { Request, Response, NextFunction } from 'express';
import { computeIsLowStock } from '../helpers/computeIsLowStock.js';
import {
  createProductSchema,
  deleteProductSchema,
  updateProductSchema,
} from '../validations/productValidation.js';
import { deleteCloudinaryImage } from '../helpers/cloudinary/deleteCloudinaryImage.js';

/*-----------------------------------------*
 * returns a paginated list of products for
 * the current store with filters for search,
 * category, brand, and stock status.
 *-----------------------------------------*/
export const getAllProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId!;
    const { search, page, stock, category, brand } = req.query;

    const limit = PAGINATION.DEFAULT_LIMIT;
    const currentPage = Number(page) || PAGINATION.DEFAULT_PAGE;
    const skip = (currentPage - 1) * limit;

    const filter: Prisma.ProductWhereInput = {
      storeId,
      deletedAt: null,
    };

    if (search) {
      const searchTerm = String(search).trim();
      filter.OR = [
        { name: { contains: searchTerm } },
        { sku: { contains: searchTerm } },
        { barcode: { contains: searchTerm } },
      ];
    }
    if (category) {
      filter.category = { slug: String(category).trim() };
    }
    if (brand) {
      filter.brand = { slug: String(brand).trim() };
    }
    if (stock === 'in-stock') {
      filter.stock = { gt: 0 };
    } else if (stock === 'out-of-stock') {
      filter.stock = { lte: 0 };
    } else if (stock === 'low-stock') {
      filter.isLowStock = true;
    }

    const [products, totalProducts] = await Promise.all([
      prisma.product.findMany({
        where: filter,
        select: {
          id: true,
          name: true,
          image: true,
          sku: true,
          barcode: true,
          stock: true,
          price: true,
          sellingPrice: true,
          minimumStockLevel: true,
          isLowStock: true,
          description: true,
          category: {
            select: { id: true, name: true, slug: true },
          },
          brand: {
            select: { id: true, name: true, slug: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where: filter }),
    ]);

    const totalPage = Math.ceil(totalProducts / limit);
    return sendResponse(res, 200, true, 'Products fetched successfully', {
      products,
      totalPage,
    });
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * returns a lightweight list of products for
 * the current store, useful for dropdowns.
 *-----------------------------------------*/

export const productList = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId!;
    const products = await prisma.product.findMany({
      where: {
        storeId,
      },
      select: {
        id: true,
        name: true,
        stock: true,
        price: true,
      },
    });
    return sendResponse(
      res,
      200,
      true,
      'Products fetched successfully',
      products,
    );
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * creates a new product for the current
 * store after validating its category, brand,
 * sku, and barcode.
 *-----------------------------------------*/
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = createProductSchema.parse(req.body);
    const storeId = res.locals.storeId!;

    const [category, brand, skuConflict, barcodeConflict] = await Promise.all([
      prisma.category.findFirst({
        where: { storeId, slug: data.category, deletedAt: null },
        select: { id: true },
      }),
      prisma.brand.findFirst({
        where: { storeId, slug: data.brand, deletedAt: null },
        select: { id: true },
      }),
      prisma.product.findFirst({
        where: { storeId, sku: data.sku, deletedAt: null },
        select: { id: true },
      }),
      data.barcode
        ? prisma.product.findFirst({
            where: { storeId, barcode: data.barcode, deletedAt: null },
            select: { id: true },
          })
        : null,
    ]);

    if (!category) {
      throw new ApiError(404, `Category '${data.category}' not found`);
    }
    if (!brand) {
      throw new ApiError(404, `Brand '${data.brand}' not found`);
    }
    if (skuConflict) {
      throw new ApiError(409, `Product with SKU '${data.sku}' already exists`);
    }
    if (barcodeConflict) {
      throw new ApiError(
        409,
        `Product with barcode '${data.barcode}' already exists`,
      );
    }

    await prisma.product.create({
      data: {
        id: await getNextId(storeId, ID_PREFIX.PRODUCT),
        storeId,
        name: data.name,
        slug: createSlug(data.name),
        image: data.image,
        sku: data.sku,
        barcode: data.barcode,
        categoryId: category.id,
        brandId: brand.id,
        description: data.description,
        price: new Prisma.Decimal(data.price),
        sellingPrice: new Prisma.Decimal(data.sellingPrice),
        stock: data.stock,
        minimumStockLevel: data.minimumStockLevel,
        isLowStock: computeIsLowStock(data.stock, data.minimumStockLevel),
      },
    });

    emitToStore(storeId, 'product:updated');
    return sendResponse(res, 201, true, 'Product created successfully');
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * updates an existing product for the
 * current store after validating its
 * category, brand, sku, and barcode.
 *-----------------------------------------*/
export const updateProduct = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const storeId = res.locals.storeId!;
    const data = updateProductSchema.parse(req.body);

    const [existing, category, brand, skuConflict, barcodeConflict] =
      await Promise.all([
        prisma.product.findFirst({
          where: { storeId, id, deletedAt: null },
          select: {
            id: true,
            stock: true,
            minimumStockLevel: true,
            image: true,
          },
        }),
        data.category
          ? prisma.category.findFirst({
              where: { storeId, slug: data.category, deletedAt: null },
              select: { id: true },
            })
          : undefined,
        data.brand
          ? prisma.brand.findFirst({
              where: { storeId, slug: data.brand, deletedAt: null },
              select: { id: true },
            })
          : undefined,
        data.sku
          ? prisma.product.findFirst({
              where: {
                storeId,
                sku: data.sku,
                deletedAt: null,
                id: { not: id },
              },
              select: { id: true },
            })
          : undefined,
        data.barcode
          ? prisma.product.findFirst({
              where: {
                storeId,
                barcode: data.barcode,
                deletedAt: null,
                id: { not: id },
              },
              select: { id: true },
            })
          : undefined,
      ]);

    if (!existing) throw new ApiError(404, 'Product not found');
    if (data.category && !category) {
      throw new ApiError(404, `Category '${data.category}' not found`);
    }
    if (data.brand && !brand) {
      throw new ApiError(404, `Brand '${data.brand}' not found`);
    }
    if (skuConflict) {
      throw new ApiError(409, `Product with SKU '${data.sku}' already exists`);
    }
    if (barcodeConflict) {
      throw new ApiError(
        409,
        `Product with barcode '${data.barcode}' already exists`,
      );
    }
    const { category: _c, brand: _b, price, sellingPrice, ...rest } = data;

    const updateData = {
      ...Object.fromEntries(
        Object.entries(rest).filter(([, value]) => value !== undefined),
      ),
      ...(price !== undefined && { price: new Prisma.Decimal(price) }),
      ...(sellingPrice !== undefined && {
        sellingPrice: new Prisma.Decimal(sellingPrice),
      }),
      ...(category && { categoryId: category.id }),
      ...(brand && { brandId: brand.id }),
      ...((data.stock !== undefined ||
        data.minimumStockLevel !== undefined) && {
        isLowStock: computeIsLowStock(
          data.stock ?? existing.stock,
          data.minimumStockLevel ?? existing.minimumStockLevel,
        ),
      }),
    };

    await Promise.all([
      prisma.product.update({
        where: { storeId_id: { storeId, id } },
        data: updateData,
      }),
      data.image && existing.image
        ? deleteCloudinaryImage(
            (existing.image as { public_id: string; url: string }).public_id,
          ).catch(err => {
            console.error('Cloudinary Delete failed:', err.message);
          })
        : Promise.resolve(),
    ]);

    emitToStore(storeId, 'product:updated');
    return sendResponse(res, 200, true, 'Product updated successfully');
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * soft deletes one or more products for the
 * current store.
 *-----------------------------------------*/
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { ids } = deleteProductSchema.parse(req.body);
    const storeId = res.locals.storeId!;

    const existingProducts = await prisma.product.findMany({
      where: {
        storeId,
        id: { in: ids },
        deletedAt: null,
      },
      select: { id: true },
    });

    if (existingProducts.length !== ids.length) {
      throw new ApiError(404, 'one and more products not found');
    }

    const result = await prisma.product.updateMany({
      where: {
        storeId,
        id: { in: ids },
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });

    emitToStore(storeId, 'product:updated');
    return sendResponse(
      res,
      200,
      true,
      `${result.count} ${result.count > 1 ? 'products' : 'product'} deleted successfully`,
    );
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * returns all suppliers linked to a product
 * for the current store.
 *-----------------------------------------*/
export const getProductSuppliers = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId!;
    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, 'Product ID is required');
    }

    const [product, links] = await Promise.all([
      prisma.product.findFirst({
        where: { storeId, id, deletedAt: null },
        select: { id: true, name: true },
      }),
      prisma.productSupplier.findMany({
        where: { storeId, productId: id },
        include: {
          supplier: {
            select: {
              id: true,
              name: true,
              shopName: true,
              phone: true,
              email: true,
              address: true,
            },
          },
        },
      }),
    ]);

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    const suppliers = links.map(l => l.supplier);

    return sendResponse(res, 200, true, 'Suppliers fetched successfully', {
      productId: product.id,
      suppliers,
    });
  } catch (error) {
    next(error);
  }
};
