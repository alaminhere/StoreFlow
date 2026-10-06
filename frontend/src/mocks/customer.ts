import { Customer } from '@/types/customer.types';
import { SalePayment } from '@/types/payment.types';

export const customers: Customer[] = [
  {
    id: '1',
    name: 'Rabi Ahmed',

    phone: '01711111111',
    email: 'rahim@example.com',
    address: 'Dhaka, Bangladesh',
    totalSale: 85000,
    totalPaid: 60000,
    totalDue: 25000,
    createdAt: '2026-09-01T10:30:00',
    updatedAt: '2026-09-10T14:20:00',
  },
  {
    id: '2',
    name: 'Karim Hasa',

    phone: '01822222222',
    email: 'karim@example.com',
    address: 'Chattogram, Bangladesh',
    totalSale: 120000,
    totalPaid: 90000,
    totalDue: 30000,
    createdAt: '2026-09-02T11:15:00',
    updatedAt: '2026-09-11T16:45:00',
  },
  {
    id: '3',
    name: 'Surat Japan',

    phone: '01933333333',
    email: 'nusrat@example.com',
    address: 'Sachet, Bangladesh',
    totalSale: 65000,
    totalPaid: 65000,
    totalDue: 0,
    createdAt: '2026-09-03T09:20:00',
    updatedAt: '2026-09-12T13:10:00',
  },
  {
    id: '4',
    name: 'Saki Hessian',

    phone: '01644444444',
    email: 'sakib@example.com',
    address: 'Rajshahi, Bangladesh',
    totalSale: 95000,
    totalPaid: 70000,
    totalDue: 25000,
    createdAt: '2026-09-04T14:00:00',
    updatedAt: '2026-09-13T10:30:00',
  },
  {
    id: '5',
    name: 'Tania Apter',

    phone: '01555555555',
    email: 'tania@example.com',
    address: 'Khulna, Bangladesh',
    totalSale: 150000,
    totalPaid: 110000,
    totalDue: 40000,
    createdAt: '2026-09-05T12:45:00',
    updatedAt: '2026-09-15T15:20:00',
  },
];

export const customerPayments: SalePayment[] =  [
  {
    id: '1',
    customerId: '1',
    saleId: '1',
    amount: 15000,
    paymentMethod: 'CASH',
    createdAt: '2026-09-10T10:30:00',
    customer: {
      name: 'Rahim Ahmed',
      address: 'Dhanmondi, Dhaka',
      email: 'rahim@example.com',
      phone: '01712345678',
    },
  },
  {
    id: '2',
    customerId: '2',
    saleId: '2',
    amount: 28000,
    paymentMethod: 'BANK_TRANSFER',
    createdAt: '2026-09-11T14:20:00',
    customer: {
      name: 'Karim Hasan',
      address: 'Mixup, Dhaka',
      email: 'karim@example.com',
      phone: '01812345678',
    },
  },
  {
    id: '3',
    customerId: '3',
    saleId: '3',
    amount: 12000,
    paymentMethod: 'BKASH',
    createdAt: '2026-09-12T11:45:00',
    customer: {
      name: 'Nusrat Jahan',
      address: 'Uttara, Dhaka',
      email: 'nusrat@example.com',
      phone: '01912345678',
    },
  },
  {
    id: '4',
    customerId: '1',
    saleId: '4',
    amount: 20000,
    paymentMethod: 'CARD',
    createdAt: '2026-09-14T09:15:00',
    customer: {
      name: 'Rahim Ahmed',
      address: 'Dhanmondi, Dhaka',
      email: 'rahim@example.com',
      phone: '01712345678',
    },
  },
  {
    id: '5',
    customerId: '4',
    saleId: '5',
    amount: 17500,
    paymentMethod: 'CASH',
    createdAt: '2026-09-15T16:10:00',
    customer: {
      name: 'Sadia Akter',
      address: 'Banani, Dhaka',
      email: 'sadia@example.com',
      phone: '01612345678',
    },
  },
];