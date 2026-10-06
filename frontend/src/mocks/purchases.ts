import { PurchasePayment } from '@/types/payment.types';
import { Purchase } from '@/types/purchases.types';

export const purchases: Purchase[] = [
  {
    id: '1',
    supplierId: '1',

    supplier: {
      id: '1',
      name: 'Rahim Ahmed',
      shopName: 'Rahim Electronics',
      email: 'alamin1developer@gmail.com',
      phone: '01712345678',
    },

    subtotal: 50000,
    discount: 2000,
    total: 48000,
    paid: 40000,
    due: 8000,
    paymentMethod: 'CASH',

    items: [
      {
        id: '1',
        purchaseId: '1',
        productId: '1',
        productName: 'Product 1',
        quantity: 10,
        price: 3000,
        total: 30000,
      },
      {
        id: '2',
        productName: 'Product 2',
        purchaseId: '1',
        productId: '2',
        quantity: 5,
        price: 4000,
        total: 20000,
      },
    ],

    createdAt: '2026-09-01T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },

  {
    id: '2',
    supplierId: '2',

    supplier: {
      id: '2',
      name: 'Karim Ahmed',
      shopName: 'Karim Traders',
      email: 'karim@example.com',
      phone: '01712345678',
    },

    subtotal: 43000,
    discount: 3000,
    total: 40000,
    paid: 30000,
    due: 10000,
    paymentMethod: 'CARD',

    items: [
      {
        id: '3',
        purchaseId: '2',
        productId: '1',
        productName: 'Product 1',
        quantity: 10,
        price: 2800,
        total: 28000,
      },
      {
        id: '4',
        purchaseId: '2',
        productId: '3',
        productName: 'Product 3',
        quantity: 20,
        price: 750,
        total: 15000,
      },
    ],

    createdAt: '2026-09-03T10:00:00.000Z',
    updatedAt: '2026-09-03T10:00:00.000Z',
  },

  {
    id: '3',
    supplierId: '3',

    supplier: {
      id: '3',
      name: 'Saab Hussein',
      shopName: 'Saki Electronics',
      email: 'sakib@example.com',
      phone: '01712345678',
    },

    subtotal: 30000,
    discount: 1000,
    total: 29000,
    paid: 29000,
    due: 0,
    paymentMethod: 'BKASH',

    items: [
      {
        id: '5',
        purchaseId: '3',
        productId: '4',
        productName: 'Product 4',
        quantity: 50,
        price: 600,
        total: 30000,
      },
    ],

    createdAt: '2026-09-05T10:00:00.000Z',
    updatedAt: '2026-09-05T10:00:00.000Z',
  },

  {
    id: '4',
    supplierId: '4',

    supplier: {
      id: '4',
      name: 'Anteed Khan',
      shopName: 'Name Wholesale',
      email: 'nayeem@example.com',
      phone: '01712345678',
    },

    subtotal: 70000,
    discount: 5000,
    total: 65000,
    paid: 50000,
    due: 15000,
    paymentMethod: 'CASH',

    items: [
      {
        id: '6',
        purchaseId: '4',
        productId: '2',
        productName: 'Product 2',
        quantity: 10,
        price: 4000,
        total: 40000,
      },
      {
        id: '7',
        purchaseId: '4',
        productId: '4',
        productName: 'Product 4',
        quantity: 50,
        price: 600,
        total: 30000,
      },
    ],

    createdAt: '2026-09-07T10:00:00.000Z',
    updatedAt: '2026-09-07T10:00:00.000Z',
  },

  {
    id: '5',
    supplierId: '5',

    supplier: {
      id: '5',
      name: 'Tanner Ahmed',
      shopName: 'Tanner Store',
      email: 'tanner@example.com',
      phone: '01712345678',
    },

    subtotal: 36000,
    discount: 2000,
    total: 34000,
    paid: 25000,
    due: 9000,
    paymentMethod: 'CARD',

    items: [
      {
        id: '8',
        purchaseId: '5',
        productId: '3',
        productName: 'Product 3',
        quantity: 30,
        price: 800,
        total: 24000,
      },
      {
        id: '9',
        purchaseId: '5',
        productId: '5',
        productName: 'Product 5',
        quantity: 6,
        price: 2000,
        total: 12000,
      },
    ],

    createdAt: '2026-09-10T10:00:00.000Z',
    updatedAt: '2026-09-10T10:00:00.000Z',
  },
];

export const  purchasesPayments: PurchasePayment[] = [
  {
    id: '1',
    supplierId: '1',
    purchaseId: '1',
    amount: 25000,
    paymentMethod: 'CASH',
    createdAt: '2026-09-10T10:30:00',
    supplier: {
      name: 'Rahim Traders',
      address: 'Chawkbazar, Dhaka',
      email: 'rahim@example.com',
      phone: '01712345678',
    },
  },
  {
    id: '2',
    supplierId: '2',
    purchaseId: '2',
    amount: 45000,
    paymentMethod: 'CASH',
    createdAt: '2026-09-11T14:20:00',
    supplier: {
      name: 'Karim Enterprise',
      address: 'Agra, Chattogram',
      email: 'karim@example.com',
      phone: '01812345678',
    },
  },
  {
    id: '3',
    supplierId: '3',
    purchaseId: '3',
    amount: 18000,
    paymentMethod: 'BKASH',
    createdAt: '2026-09-12T11:45:00',
    supplier: {
      name: 'Smart Distribution',
      address: 'Mirror, Dhaka',
      email: 'smart@example.com',
      phone: '01912345678',
    },
  },
  {
    id: '4',
    supplierId: '1',
    purchaseId: '4',
    amount: 32000,
    paymentMethod: 'CASH',
    createdAt: '2026-09-14T09:15:00',
    supplier: {
      name: 'Rahim Traders',
      address: 'Chawkbazar, Dhaka',
      email: 'rahim@example.com',
      phone: '01712345678',
    },
  },
  {
    id: '5',
    supplierId: '4',
    purchaseId: '5',
    amount: 27500,
    paymentMethod: 'CASH',
    createdAt: '2026-09-15T16:10:00',
    supplier: {
      name: 'New Star Suppliers',
      address: 'Utter, Dhaka',
      email: 'newstar@example.com',
      phone: '01612345678',
    },
  },
];
