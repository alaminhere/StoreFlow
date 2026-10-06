export type InvoicePartyType = 'customer' | 'supplier';

export type InvoiceStatus = 'paid' | 'partial' | 'due';

export interface InvoiceStore {
  id: string;
  name: string;
  email?: string;
  phone?: string;

  logo?: {
    url?: string;
    public_id?: string;
  };

  tagline?: string;
  address?: string;
}

export interface InvoiceParty {
  name: string;
  businessName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface InvoiceItem {
  name: string;
  qty: number;
  price: number;
  total: number;
}

export interface InvoiceData {
  invoiceNo: string;
  issueDate: string;
  dueDate?: string;

  status: InvoiceStatus;

  store: InvoiceStore;

  partyType: InvoicePartyType;
  party: InvoiceParty;

  items: InvoiceItem[];

  subtotal: number;
  discount: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;

  paymentMethod?: string;
}
