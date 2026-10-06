import { PaymentMethod } from './payment.types';

export interface PurchaseItem {
  id: string;
  purchaseId: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Purchase {
  id: string;
  supplierId: string;
  supplier: {
    id: string;
    name: string;
    shopName: string;
    email: string;
    phone: string;
  };
  subtotal: number;
  discount: number;
  total: number;
  paid: number;
  due: number;
  paymentMethod?: PaymentMethod;
  items: PurchaseItem[];
  createdAt: string;
  updatedAt: string;
}

export type CreatePurchaseItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
};

export type CreatePurchase = {
  supplierId: string;
  dueDate: string;
  items: CreatePurchaseItem[];
  paymentMethod?: PaymentMethod;
  subtotal: number;
  discount: number;
  paid: number;
  total: number;
};
