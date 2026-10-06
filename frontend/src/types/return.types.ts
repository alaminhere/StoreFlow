import { PaymentMethod } from './payment.types';

export type ReturnType = 'SALE_RETURN' | 'PURCHASE_RETURN';
export type ReturnCondition = 'RESTOCK' | 'DAMAGE';

// Search Return API Response
export interface SearchReturnParty {
  name: string;
  phone: string;
}
export interface ReturnSearchItem {
  id?: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  alreadyReturned: number;
  returnable: number;
}

export interface ReturnSearchResponse {
  id: string;
  party: SearchReturnParty;
  total: number;
  paid: number;
  due: number;
  createdAt: string;
  items: ReturnSearchItem[];
}

// Return Form Values
export interface ReturnFormValues {
  type: ReturnType;
  referenceId: string;
  reason: string;
  condition: ReturnCondition;
}

// Create Return API Request
export interface CreateReturnItemRequest {
  productId: string;
  quantity: number;
}
export interface CreateReturnRequest {
  type: ReturnType;
  referenceId: string;
  reason: string;
  condition: ReturnCondition;
  items: CreateReturnItemRequest[];
}

// Return API Response
export interface ReturnParty {
  name: string;
  shopName?: string;
  email: string;
  phone: string;
  address: string;
}
export interface ReturnItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}
export interface Return {
  id: string;
  type?: string;
  reason?: string;
  condition?: string;
  createdAt: string;
  items: ReturnItem[];
  party: ReturnParty;
  subtotal: number;
  discount: number;
  total: number;
  paid: number;
  due: number;
  paymentMethod: PaymentMethod;
}
