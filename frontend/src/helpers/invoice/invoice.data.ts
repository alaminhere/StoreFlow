/* eslint-disable @typescript-eslint/no-explicit-any */
import getInvoiceStatus from '../InvoiceStatus';
import { InvoiceData, InvoiceStore } from '@/types/invoice.types';

export const buildPurchaseInvoiceData = (
  store: InvoiceStore,
  purchase: any,
): InvoiceData => {
  return {
    invoiceNo: `INV-${purchase.id}`,
    issueDate: purchase.createdAt,
    status: getInvoiceStatus(purchase.paid, purchase.due),
    store,
    partyType: 'supplier',
    party: {
      name: purchase.supplier.name,
      businessName: purchase.supplier.shopName,
      phone: purchase.supplier.phone,
      email: purchase.supplier.email,
      address: purchase.supplier.address,
    },

    items: purchase.items.map((item: any) => ({
      name: item.productName,
      qty: item.quantity,
      price: item.price,
      total: item.total,
    })),

    subtotal: purchase.subtotal,
    discount: purchase.discount,
    grandTotal: purchase.total,
    paidAmount: purchase.paid,
    dueAmount: purchase.due,
    paymentMethod: purchase.paymentMethod,
  };
};

/* --------------------------------
   Sale Invoice
--------------------------------- */

export const buildSaleInvoiceData = (
  store: InvoiceStore,
  sale: any,
): InvoiceData => {
  return {
    invoiceNo: `INV-${sale.id}`,
    issueDate: sale.createdAt,
    status: getInvoiceStatus(sale.paid, sale.due),
    store,
    partyType: 'customer',
    party: {
      name: sale.customer.name,
      phone: sale.customer.phone,
      email: sale.customer.email,
      address: sale.customer.address,
    },

    items: sale.items.map((item: any) => ({
      name: item.productName,
      qty: item.quantity,
      price: item.price,
      total: item.total,
    })),

    subtotal: sale.subtotal,
    discount: sale.discount,
    grandTotal: sale.total,
    paidAmount: sale.paid,
    dueAmount: sale.due,
    paymentMethod: sale.paymentMethod,
  };
};
