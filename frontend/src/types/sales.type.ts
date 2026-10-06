import { PaymentMethod } from './payment.types';

export interface SalesItem {
  id: string;
  SalesId: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Sales {
  id: string;
  customerId?: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };

  subtotal: number;
  discount: number;
  total: number;
  paid: number;
  due: number;
  paymentMethod?: PaymentMethod;
  items: SalesItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSalesItem {
  productName: string;
  productId: string;
  quantity: number;
  price: number;
  total: number;
  stock?: number;
}
export interface CreateSales {
  customerId: string;
  items: CreateSalesItem[];
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  paid: number;
  total: number;
  // due = total -paid
}
