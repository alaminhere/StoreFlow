'use client';

import type { InvoiceStore } from '@/types/invoice.types';
import { generateInvoicePDF } from './invoice.pdf';
import handleAlert from '../handleAlert';
import useSendInvoiceEmail from './useSendInvoiceEmail';
import { buildPurchaseInvoiceData, buildSaleInvoiceData } from './invoice.data';

interface Options<T> {
  type: 'purchase' | 'sale';
  store?: InvoiceStore | null;
  data?: T | null;
}

const useInvoiceActions = <T>({ type, store, data }: Options<T>) => {
  const { sendInvoice, isLoading } = useSendInvoiceEmail();

  const getInvoiceData = () => {
    if (!store || !data) {
      handleAlert(false, 'Store data is incomplete');
      return null;
    }
    return type === 'purchase'
      ? buildPurchaseInvoiceData(store, data)
      : buildSaleInvoiceData(store, data);
  };

  const downloadInvoice = () => {
    const invoiceData = getInvoiceData();
    if (invoiceData) generateInvoicePDF(invoiceData);
  };

  const sendInvoiceByEmail = () => {
    const invoiceData = getInvoiceData();
    if (invoiceData) sendInvoice(invoiceData);
  };

  return { downloadInvoice, sendInvoiceByEmail, isSending: isLoading };
};

export default useInvoiceActions;
