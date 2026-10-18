'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

import handleAlert from '@/helpers/handleAlert';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';
import { useCreateReturnMutation } from '@/redux/feature/returnSlice';
import { useLazyGetSaleForReturnQuery } from '@/redux/feature/SaleSlice';
import { useLazyGetPurchaseForReturnQuery } from '@/redux/feature/purchaseSlice';

import formatPrice from '@/helpers/formatPrice';
import PopupModal from '../PopupModal';
import Th from '@/components/table/Th';
import Tr from '@/components/table/Tr';
import Checkbox from '@/components/ui/Checkbox';
import Td from '@/components/table/Td';
import formatDate from '@/helpers/formatDate';
import Textarea from '@/components/ui/textarea';

import {
  CreateReturnItemRequest,
  ReturnFormValues,
  Return,
  ReturnSearchResponse,
} from '@/types/return.types';
import ReturnInvoice from './ReturnInvoice';

const COLUMNS = [
  { label: 'Select ', align: 'left' },
  { label: 'Product', align: 'center' },
  { label: 'Price', align: 'left' },
  { label: 'Qty', align: 'left' },
  { label: 'Returned', align: 'left' },
  { label: 'Return Qty', align: 'right' },
];

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const ReturnForm = ({ open, setOpen }: Props) => {
  const [invoice, setInvoice] = useState<Return | null>(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [reference, setReference] = useState<ReturnSearchResponse | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [selected, setSelected] = useState<CreateReturnItemRequest[]>([]);

  const [createReturn, { isLoading }] = useCreateReturnMutation();
  const [getSaleForReturn, { isFetching: saleLoading }] =
    useLazyGetSaleForReturnQuery();
  const [getPurchaseForReturn, { isFetching: purchaseLoading }] =
    useLazyGetPurchaseForReturnQuery();
  const searchLoading = saleLoading || purchaseLoading;

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ReturnFormValues>({
    defaultValues: { type: 'SALE_RETURN', condition: 'RESTOCK' },
  });

  const resetSearch = () => {
    setReference(null);
    setNotFound(false);
    setSelected([]);
  };

  const handleSearch = async () => {
    const { type, referenceId } = getValues();
    const id = referenceId?.trim();
    if (!id) return;
    resetSearch();
    try {
      const res =
        type === 'SALE_RETURN'
          ? await getSaleForReturn(id).unwrap()
          : await getPurchaseForReturn(id).unwrap();
      setReference(res.data);
      setNotFound(!res.data);
    } catch {
      setNotFound(true);
    }
  };

  const toggleItem = (item: CreateReturnItemRequest) => {
    setSelected(prev =>
      prev.some(s => s.productId === item.productId)
        ? prev.filter(s => s.productId !== item.productId)
        : [...prev, { productId: item.productId, quantity: 1 }],
    );
  };

  const changeQty = (productId: string, quantity: number) => {
    setSelected(prev =>
      prev.map(s => (s.productId === productId ? { ...s, quantity } : s)),
    );
  };

  const isQtyValid = selected.every(s => {
    const item = reference?.items.find(i => i.productId === s.productId);
    return !!item && s.quantity >= 1 && s.quantity <= item.returnable;
  });

  const refund =
    reference?.items.reduce(
      (sum, i) =>
        sum +
        i.price *
          (selected.find(s => s.productId === i.productId)?.quantity ?? 0),
      0,
    ) ?? 0;

  const dueAmount = reference?.due ?? 0;
  const adjustedDue = dueAmount > 0 ? Math.min(dueAmount, refund) : 0;
  const cashRefund = refund - adjustedDue;
  const remainingDue = dueAmount - adjustedDue;

  const isSubmitValid = selected.length > 0 && isQtyValid;
  const onSubmit = async (data: ReturnFormValues) => {
    if (!reference || !isSubmitValid) return;
    try {
      const payload = {
        type: data.type,
        referenceId: reference.id,
        reason: data.reason.trim(),
        condition: data.condition,
        items: selected,
      };
      const res = await createReturn(payload).unwrap();
      if (res?.success) {
        setInvoice(res.data);
        setOpen(false);
        setInvoiceOpen(true);
        resetSearch();
      }
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    }
  };

  return (
    <>
      {open && (
        <PopupModal
          onClose={() => setOpen(false)}
          label={'Add New Return'}
          className="max-w-200!"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            <div className="space-y-3 rounded-lg border border-border p-4">
              <div className="flex gap-6">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    value="SALE_RETURN"
                    className="accent-primary"
                    {...register('type', { onChange: resetSearch })}
                  />
                  Sale Return
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    value="PURCHASE_RETURN"
                    className="accent-primary"
                    {...register('type', { onChange: resetSearch })}
                  />
                  Purchase Return
                </label>
              </div>

              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    label="Reference id"
                    placeholder="sale_001"
                    {...register('referenceId', {
                      required: 'Reference ID is required',
                    })}
                    error={errors.referenceId}
                  />
                </div>
                <Button
                  type="button"
                  size="md"
                  disabled={searchLoading}
                  onClick={handleSearch}
                  loading={searchLoading}
                >
                  Search
                </Button>
              </div>

              {notFound && (
                <p className="p14 text-danger">Reference not found</p>
              )}
            </div>

            {reference && (
              <>
                {/* party information */}
                <h4>Party Information</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg border border-border p-3.5">
                  <div>
                    <dt className="p12">Name</dt>
                    <dd className="line-clamp-1 p14 font-medium text-text">
                      {reference.party.name}
                    </dd>
                  </div>

                  <div>
                    <dt className="p12">Phone</dt>
                    <dd className="p14 text-text">{reference.party.phone}</dd>
                  </div>

                  <div>
                    <dt className="p12">Date</dt>
                    <dd className="p14 text-text">
                      {formatDate(reference.createdAt)}
                    </dd>
                  </div>

                  <div>
                    <dt className="p12">Total</dt>
                    <dd className="p14 text-text">
                      {formatPrice(reference.total)}
                    </dd>
                  </div>

                  <div className="col-span-2 flex items-center justify-between border-t border-border pt-3">
                    <dt className="p14 text-primary">Due</dt>
                    <dd className="text-base font-semibold text-primary">
                      {formatPrice(reference.due)}
                    </dd>
                  </div>
                </div>

                {/* Items */}
                <div className="overflow-x-auto rounded-lg border border-border bg-surface">
                  <table className="w-full min-w-130 text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        {COLUMNS.map(col => (
                          <Th
                            key={col.label}
                            className={clsx(
                              col.align === 'right'
                                ? 'text-right'
                                : 'text-left',
                            )}
                          >
                            <span
                              className={clsx('inline-flex items-center gap-1')}
                            >
                              {col.label}
                            </span>
                          </Th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {reference.items.map(item => {
                        const disabled = item.returnable === 0;
                        const isChecked = selected.some(
                          s => s.productId === item.productId,
                        );
                        const qty =
                          selected.find(s => s.productId === item.productId)
                            ?.quantity ?? 0;
                        return (
                          <Tr
                            key={item.productId}
                            className={clsx(
                              'border-b border-border last:border-0',
                              isChecked && 'bg-sidebar-active-bg',
                              disabled && 'opacity-50 hover:bg-surface',
                            )}
                          >
                            <Td>
                              <Checkbox
                                disabled={disabled}
                                checked={isChecked}
                                onChange={() => toggleItem(item)}
                              />
                            </Td>
                            <Td>{item.productName}</Td>
                            <Td>{formatPrice(item.price)}</Td>
                            <Td>{item.quantity}</Td>
                            <Td>{item.alreadyReturned}</Td>
                            <Td>
                              <Input
                                type="number"
                                min={1}
                                max={item.returnable}
                                disabled={!isChecked}
                                value={isChecked ? qty : 0}
                                onChange={e =>
                                  changeQty(
                                    item.productId,
                                    Number(e.target.value),
                                  )
                                }
                                className="px-3! py-2!"
                              />
                            </Td>
                          </Tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {/* Reason + Condition */}
                <div className="space-y-3 rounded-lg border border-border p-4">
                  <Textarea
                    label="Reason *"
                    rows={2}
                    placeholder="Why is this being returned?"
                    {...register('reason', {
                      required: 'Reason is required',
                      minLength: { value: 2, message: 'Minimum 2 characters' },
                      maxLength: {
                        value: 250,
                        message: 'Maximum 250 characters',
                      },
                    })}
                    error={errors.reason}
                  />
                  <div className="flex gap-6">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        value="RESTOCK"
                        className="accent-primary"
                        {...register('condition')}
                      />
                      Restock
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        value="DAMAGE"
                        className="accent-primary"
                        {...register('condition')}
                      />
                      Damage
                    </label>
                  </div>
                </div>
                {/* Summary */}

                <div className="space-y-2 rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <p className="p14">Items selected: {selected.length}</p>
                    <p className="p14 font-medium text-primary">
                      Refund: {formatPrice(refund)}
                    </p>
                  </div>

                  {adjustedDue > 0 && (
                    <>
                      <div className="flex items-center justify-between border-t border-border pt-2">
                        <p className="p14 text-text-muted">Adjust with Due</p>
                        <p className="p14 font-medium text-warning">
                          − {formatPrice(adjustedDue)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="p14 font-semibold text-success">
                          Cash Refund
                        </p>
                        <p className="p14 font-semibold text-success">
                          {formatPrice(cashRefund)}
                        </p>
                      </div>

                      {remainingDue > 0 && (
                        <div className="flex items-center justify-between border-t border-border pt-2">
                          <p className="p14 text-text-muted">
                            Remaining Due after return
                          </p>
                          <p className="p14 text-danger">
                            {formatPrice(remainingDue)}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" size="md" onClick={resetSearch}>
                    Cancel
                  </Button>
                  <Button
                    size="md"
                    type="submit"
                    disabled={!isSubmitValid || isLoading}
                    loading={isLoading}
                  >
                    Create Return
                  </Button>
                </div>
              </>
            )}
          </form>
        </PopupModal>
      )}
      <ReturnInvoice
        invoice={invoice}
        open={invoiceOpen}
        setOpen={setInvoiceOpen}
        setInvoice={setInvoice}
      />
    </>
  );
};

export default ReturnForm;
