// WHAT: Invoice settings for managing invoice footer and invoice configuration

'use client';

import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Textarea from '@/components/ui/textarea';

import handleAlert from '@/helpers/handleAlert';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';

import { useUpdateStoreMutation } from '@/redux/feature/storeSlice';
import { Store } from '@/types/store.types';

const InvoiceSetting = ({ store }: { store: Store }) => {
  const [updateStore, { isLoading }] = useUpdateStoreMutation();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const invoiceFooterNote = formData.get('invoiceFooterNote') as string;

    const payload = {
      invoiceFooterNote,
    };
    console.log(payload);
    try {
      const res = await updateStore(payload).unwrap();
      if (!res) return;
      handleAlert(res.success, res.message || '');
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h3>Invoice Settings</h3>
      <p className="p14">
        Controls how new invoice numbers and due dates are generated.
      </p>

      <div className="mt-5 space-y-3 border-t border-border pt-4">
        <div className="flex flex-col gap-5 lg:flex-row">
          <Input
            disabled
            label="Invoice Prefix"
            placeholder="INV-"
            name="invoicePrefix"
            defaultValue={'INV-'}
          />

          <Input
            disabled
            label="Next Invoice Number"
            placeholder="2042"
            type="number"
            name="nextInvoiceNumber"
            defaultValue={1}
          />
        </div>

        <div className="flex flex-col gap-5 lg:flex-row">
          <Input
            disabled
            label="Default text"
            placeholder="0"
            type="number"
            name="defaultTax"
            defaultValue={0}
          />

          <Input
            disabled
            label="Default Due Period (days)"
            placeholder="30"
            type="number"
            name="defaultDuePeriod"
            defaultValue={30}
          />
        </div>
        <Input
          disabled
          label="Currency Symbol"
          placeholder="৳"
          name="currencySymbol"
          defaultValue="৳"
        />
        <Textarea
          label="Invoice Footer Note"
          placeholder="Thank you for your business!"
          name="invoiceFooterNote"
          defaultValue={
            store?.invoiceFooterNote.trim() || 'Thank you for your business!'
          }
        />
        <Button
          disabled={isLoading}
          loading={isLoading}
          type="submit"
          className="w-fit"
        >
          Save changes
        </Button>
      </div>
    </form>
  );
};

export default InvoiceSetting;
