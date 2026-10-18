export type PaymentMethod =
  | 'CASH'
  | 'BANK_TRANSFER'
  | 'BKASH'
  | 'CARD'
  | 'RETURN_ADJUSTMENT';

export interface PurchasePayment {
  id: string;
  storeId?: string;
  supplierId: string;
  purchaseId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
  supplier?: {
    name: string;
    address: string;
    email: string;
    phone: string;
  };
}

export interface ReceivedPurchasePayment {
  purchaseId: string;
  amount: number;
  paymentMethod: PaymentMethod;
}

export interface SalePayment {
  id: string;
  storeId?: string;
  customerId: string;
  saleId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
  customer: {
    name: string;
    address: string;
    email: string;
    phone: string;
  };
}

export interface ReceivedSalePayment {
  saleId: string;
  amount: number;
  paymentMethod: PaymentMethod;
}
