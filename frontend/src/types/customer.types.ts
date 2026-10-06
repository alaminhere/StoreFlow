export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  totalSale: number;
  totalPaid: number;
  totalDue: number;

  createdAt: string;
  updatedAt: string;
}

export interface CustomerList {
  id: string;
  name: string;
  email: string;
}

export interface CreateCustomer {
  name: string;
  phone: string;
  email: string;
  address: string;
}
export type UpdateCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
};
