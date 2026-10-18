'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import PopupModal from '../PopupModal';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';

import handleAlert from '@/helpers/handleAlert';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';
import { useCreatePurchaseMutation } from '@/redux/feature/purchaseSlice';
import formatPrice from '@/helpers/formatPrice';
import { X } from '@/helpers/icon/icon';
import { PaymentMethod } from '@/types/payment.types';
import { useProductListQuery } from '@/redux/feature/productSlice';
import { useSupplierListQuery } from '@/redux/feature/supplierSlice';
import generateId from '@/helpers/generateId';
import { CreatePurchase } from '@/types/purchases.types';

const paymentMethods: PaymentMethod[] = [
  'CASH',
  'BKASH',
  'BANK_TRANSFER',
  'CARD',
  'RETURN_ADJUSTMENT',
];

const styles = {
  option: 'bg-surface text-text',
  summaryRow:
    'flex items-center justify-between p14 text-text border-b border-border pb-2.5 mb-2.5',
  inputRow:
    'flex items-center justify-between gap-4 p14 text-text border-b border-border pb-2.5 mb-2.5',
  th: 'py-2 px-2 p14 text-text font-normal',
  td: 'py-2 px-2',
};

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};
type PurchasePaymentData = {
  discount: number;
  dueDate?: string;
  paid: number;
  paymentMethod: PaymentMethod;
  supplierId: string;
};
type PurchaseItemData = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
};

const PurchaseForm = ({ open, setOpen }: Props) => {
  const [createPurchase, { isLoading }] = useCreatePurchaseMutation();

  const { data: productData } = useProductListQuery();
  const { data: supplierData } = useSupplierListQuery();

  const products = productData?.data ?? [];
  const suppliers = supplierData?.data || [];

  const emptyItem = (): PurchaseItemData => ({
    id: generateId(),
    productId: '',
    productName: '',
    quantity: 1,
    price: 0,
    total: 0,
  });

  const [items, setItems] = useState<PurchaseItemData[]>([emptyItem()]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PurchasePaymentData>({
    mode: 'onBlur',
    defaultValues: {
      discount: 0,
      paid: 0,
      paymentMethod: 'CASH',
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const discount = Number(watch('discount')) || 0;
  const paid = Number(watch('paid')) || 0;

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.quantity * item.price, 0),
    [items],
  );

  const discountAmount = Math.min(discount, subtotal);
  const total = subtotal - discountAmount;
  const due = Math.max(total - paid, 0);

  const addItem = () => setItems(prev => [emptyItem(), ...prev]);
  //  select product this empty item
  const handleProductChange = (itemId: string, productId: string) => {
    const product = products?.find(item => item.id === productId);
    const price = product?.price ?? 0;
    const quantity = 1;
    setItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? {
              ...item,
              productId,
              productName: product?.name ?? '',
              quantity: 1,
              price: product?.price ?? 0,
              total: quantity * price,
            }
          : item,
      ),
    );
  };

  // update this product qty or price
  const updateItem = (
    id: string,
    field: 'quantity' | 'price',
    value: string | number,
  ) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };
        return {
          ...updated,
          total: updated.quantity * updated.price,
        };
      }),
    );
  };

  const removeItem = (id: string) => {
    setItems(prev =>
      prev.length === 1 ? prev : prev.filter(item => item.id !== id),
    );
  };

  const onSubmit = async (data: PurchasePaymentData) => {
    if (!data.supplierId) {
      handleAlert(false, 'Please select a supplier');
      return;
    }

    if (items.some(item => !item.productId)) {
      handleAlert(false, 'Please select products');
      return;
    }

    if (paid > total) {
      handleAlert(false, 'Paid amount cannot be greater than total');
      return;
    }

    const payload: CreatePurchase = {
      dueDate: data.dueDate!,
      paymentMethod: data.paymentMethod,
      supplierId: data.supplierId,

      subtotal,
      discount: discountAmount,
      paid,
      total,
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        productName: item.productName,
        price: item.price,
        total: item.total,
      })),
    };
    try {
      const res = await createPurchase(payload).unwrap();
      if (!res) return;

      handleAlert(res.success, res.message);

      if (res.success) {
        reset();
        setItems([emptyItem()]);
        setOpen(false);
      }
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    }
  };

  return (
    <>
      {open && (
        <PopupModal
          className="max-w-4xl"
          onClose={() => setOpen(false)}
          label="Add New Purchase"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Supplier / Due Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
              <Select
                label="Supplier"
                placeholder="Select supplier"
                {...register('supplierId', {
                  required: 'Supplier is required',
                })}
                error={errors.supplierId}
              >
                {suppliers.map(supplier => (
                  <option
                    key={supplier.id}
                    value={supplier.id}
                    className={styles.option}
                  >
                    {supplier.name}
                  </option>
                ))}
              </Select>
              <Input label="Due Date" type="date" />
            </div>

            {/* Products Header */}
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={addItem}
                className="p14 text-primary cursor-pointer"
              >
                + Add Item
              </button>
            </div>

            {/* Product Items - Table */}
            <div className="overflow-x-auto border border-border rounded-lg mb-5">
              <table className="w-full min-w-160">
                <colgroup>
                  <col className="w-5/12" />
                  <col className="w-2/12" />
                  <col className="w-2/12" />
                  <col className="w-2/12" />
                  <col className="w-1/12" />
                </colgroup>
                <thead>
                  <tr className="border-b border-border bg-accent-bg">
                    <th className={`${styles.th} text-left`}>Product</th>
                    <th className={`${styles.th} text-center`}>Qty</th>
                    <th className={`${styles.th} text-right`}>Price</th>
                    <th className={`${styles.th} text-right`}>Total</th>
                    <th className={styles.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => {
                    const itemTotal = item.quantity * item.price;

                    return (
                      <tr
                        key={item.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className={styles.td}>
                          <Select
                            placeholder="Select product"
                            value={item.productId}
                            onChange={e =>
                              handleProductChange(item.id!, e.target.value)
                            }
                          >
                            <option className={styles.option}>
                              Select Product
                            </option>
                            {products.map(product => (
                              <option
                                key={product.id}
                                value={product.id}
                                className={styles.option}
                              >
                                {product.name}
                              </option>
                            ))}
                          </Select>
                        </td>

                        <td className={styles.td}>
                          <Input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={e =>
                              updateItem(
                                item.id!,
                                'quantity',
                                Math.max(1, Number(e.target.value)),
                              )
                            }
                            className="text-center"
                          />
                        </td>

                        <td className={styles.td}>
                          <Input
                            type="number"
                            min={1}
                            value={item.price}
                            onChange={e =>
                              updateItem(
                                item.id!,
                                'price',
                                Number(e.target.value),
                              )
                            }
                            className="text-right"
                          />
                        </td>

                        <td
                          className={`${styles.td} text-right p14 text-text whitespace-nowrap`}
                        >
                          {formatPrice(itemTotal)}
                        </td>

                        <td className={`${styles.td} text-right`}>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id!)}
                            disabled={items.length === 1}
                            className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <X size={14} className="text-danger!" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="mt-5 ml-auto w-full md:w-100">
              <div className={styles.summaryRow}>
                <span>Items</span>
                <span>
                  {items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>

              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className={styles.inputRow}>
                <span className="w-1/2">Discount ৳</span>
                <Input
                  type="number"
                  min={0}
                  {...register('discount', { valueAsNumber: true, min: 0 })}
                  className="w-1/2 text-right p14 px-2!"
                />
              </div>

              <div className="flex items-center justify-between p14 text-text mb-3.5">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <div className="flex items-center justify-between gap-4 p14 text-success py-2.5 border-b border-border mb-2.5">
                <span className="w-1/2">Paid ৳</span>
                <Input
                  type="number"
                  min={0}
                  {...register('paid', { valueAsNumber: true, min: 0 })}
                  className="w-1/2 p14 text-right"
                />
              </div>

              <div className="flex items-center justify-between p14 text-warning mb-3.5 bg-warning-bg rounded-lg px-3 py-2.5">
                <span>Due</span>
                <span>{formatPrice(due)}</span>
              </div>

              <Select
                label="Payment Method"
                placeholder="Select payment method"
                {...register('paymentMethod', {
                  required: 'Payment method is required',
                })}
              >
                {paymentMethods.map(method => (
                  <option key={method} value={method} className={styles.option}>
                    {method}
                  </option>
                ))}
              </Select>

              <Button
                type="submit"
                disabled={isLoading}
                loading={isLoading}
                className="mt-5 w-full"
              >
                Submit Purchase
              </Button>
            </div>
          </form>
        </PopupModal>
      )}
    </>
  );
};

export default PurchaseForm;
