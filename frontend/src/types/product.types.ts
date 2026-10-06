export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';
type image = {
  url: string;
  public_id: string;
};

export interface Product {
  id: string;
  name: string;
  image: image;
  sku: string;
  barcode: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  brand: {
    id: string;
    name: string;
    slug: string;
  };
  stock: number;
  price: number;
  sellingPrice: number;
  minimumStockLevel: number;
  isLowStock?: boolean;

  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProduct {
  name: string;
  image: image;
  barcode: string;
  sku: string;
  category: string;
  brand: string;
  stock: number;
  price: number;
  sellingPrice: number;
  minimumStockLevel: number;

  description: string;
}
export interface UpdateProduct {
  id: string;
  name: string;
  image: image;
  barcode: string;
  sku: string;
  category: string;
  brand: string;
  stock: number;
  price: number;
  sellingPrice: number;
  minimumStockLevel: number;

  description: string;
}

export type Supplier = {
  id: string;
  name: string;
  shopName: string;
  phone: string;
  email: string;
  address: string;
};

export interface ProductSupplier {
  productId: string;
  suppliers: Supplier[];
}

// MOVEMENT TYPE

export type StockMovementType =
  | 'PURCHASE'
  | 'SALE'
  | 'RETURN'
  | 'STOCK_IN'
  | 'STOCK_OUT'
  | 'DAMAGE';

export interface StockMovement {
  id: string;
  productId: string;
  type: StockMovementType;
  reason?: string;
  beforeStock: number;
  afterStock: number;
  createdAt: string;
}

export interface CreateStockMovement {
  productId: string;
  quantity: number;
  type: StockMovementType;
  reason: string;
}
