'use client';

import handleAlert from '../handleAlert';
import { getInvoicePDFBlob } from './invoice.pdf';
import getApiErrorMessage from '../getApiErrorMessage';
import type { InvoiceData } from '@/types/invoice.types';
import { useSendInvoiceEmailMutation } from '@/redux/feature/invoiceApi';

const useSendInvoiceEmail = () => {
  const [sendInvoiceEmail, { isLoading }] = useSendInvoiceEmailMutation();

  const sendInvoice = async (invoice: InvoiceData) => {
    const email = invoice.party.email;
    if (!email) {
      handleAlert(false, 'No email address for this party');
      return false;
    }
    try {
      const formData = new FormData();
      formData.append(
        'pdf',
        getInvoicePDFBlob(invoice),
        `${invoice.invoiceNo}.pdf`,
      );
      formData.append('to', email);
      formData.append('invoiceNo', invoice.invoiceNo);
      formData.append('partyName', invoice.party.name);
      formData.append('storeName', invoice.store.name);

      await sendInvoiceEmail(formData).unwrap();
      handleAlert(true, `Invoice sent to ${email}`);
      return true;
    } catch (err: unknown) {
      handleAlert(false, getApiErrorMessage(err));
      return false;
    }
  };

  return { sendInvoice, isLoading };
};

export default useSendInvoiceEmail;
