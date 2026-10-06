export interface Supplier {
  id: string;
  name: string;
  shopName: string;
  phone: string;
  email: string;
  address: string;

  totalPurchase: number;
  totalPaid: number;
  totalDue: number;

  createdAt: string;
  updatedAt: string;
}

export interface SupplierList {
  id: string;
  name: string;
  email: string;
}
export interface CreateSupplier {
  name: string;
  shopName: string;
  phone: string;
  email: string;
  address: string;
}

export interface UpdateSupplier {
  id: string;
  name: string;
  shopName: string;
  phone: string;
  email: string;
  address: string;
}
