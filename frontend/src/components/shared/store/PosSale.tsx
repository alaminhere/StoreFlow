/* eslint-disable react-hooks/incompatible-library */

'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import Loading from '@/components/shared/Loading';
import SearchInput from '@/components/shared/store/SearchInput';
import ProductsFilter from '@/components/shared/store/ProductsFilter';

import handleAlert from '@/helpers/handleAlert';
import { Minus, Plus, X } from '@/helpers/icon/icon';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';

import { useCreateSaleMutation } from '@/redux/feature/SaleSlice';
import { useAllProductQuery } from '@/redux/feature/productSlice';
import { useCustomerListQuery } from '@/redux/feature/customerSlice';

import { Product } from '@/types/product.types';
import { PaymentMethod } from '@/types/payment.types';
import { CreateSales, CreateSalesItem, Sales } from '@/types/sales.type';

import formatPrice from '@/helpers/formatPrice';
import SaleInvoice from '../entity-forms/SaleInvoice';

const PAYMENT_METHODS: PaymentMethod[] = [
  'BANK_TRANSFER',
  'BKASH',
  'CASH',
  'CARD',
];

const styles = {
  option: 'bg-surface text-text',
  summaryRow:
    'flex items-center justify-between p12 text-text border-b border-border py-1.5 ',
  btn: 'flex p-1.5 cursor-pointer items-center justify-center rounded-md border border-border text-text disabled:cursor-not-allowed disabled:opacity-40',
  qtyBtnWrap: 'flex items-center gap-2',
  cartItem: 'rounded-lg border border-border bg-accent-bg/50 p-2',
  productCard:
    'relative overflow-hidden rounded-xl bg-surface cursor-pointer border border-border',
  productCardOutOfStock:
    'relative overflow-hidden rounded-xl bg-surface cursor-not-allowed border-danger opacity-60',
};

const PosSales = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const stock = searchParams.get('stock') || '';
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';

  const query = {
    page,
    search,
    stock,
    category,
    brand,
  };

  // fetch customers, products, and create sale mutation

  const { data: customerData } = useCustomerListQuery();
  const { data: productData, isLoading } = useAllProductQuery(query);
  const [createSale, { isLoading: saleLoading }] = useCreateSaleMutation();

  const PRODUCTS = productData?.data.Products ?? [];
  const customers = customerData?.data ?? [];

  // manage POS sale form and validation
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateSales>({
    mode: 'onBlur',
    defaultValues: {
      discount: 0,
      paid: 0,
      paymentMethod: 'CASH',
    },
  });

  const [items, setItems] = useState<CreateSalesItem[]>([]);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [invoice, setInvoice] = useState<Sales | null>(null);

  const handleAdd = (data: Product) => {
    if (data.stock === 0) return;

    setItems(prev => {
      const exists = prev.find(item => item.productId === data.id);

      if (exists) {
        if (exists.quantity >= data.stock) {
          handleAlert(false, `Only ${exists.stock} in stock`);
          return prev;
        }

        return prev.map(item =>
          item.productId === data.id
            ? {
              ...item,
              quantity: item.quantity + 1,
              total: (item.quantity + 1) * item.price

            }
            : item,
        );
      }

      return [
        ...prev,
        {
          productId: data.id,
          productName: data.name,
          price: data.sellingPrice,
          quantity: 1,
          total: data.sellingPrice,
          stock: data.stock,
        },
      ];
    });
  };

  const changeQuantity = (productId: string, delta: 1 | -1) => {
    const exists = items.find(item => item.productId === productId);
    if (!exists) return;
    const next = exists.quantity + delta;
    if (next < 1) return;
    if (next > exists.stock!) {
      handleAlert(false, `Only ${exists.stock} in stock`);
      return;
    }

    setItems(prev =>
      prev.map(item =>
        item.productId === productId
          ? {
            ...item,
            quantity: next,
            total: next * item.price,
          }
          : item,
      ),
    );
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  // calculate subtotal, discount, total, paid, and due
  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.quantity * item.price, 0),
    [items],
  );

  const discountPercent = Number(watch('discount')) || 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = subtotal - discountAmount;
  const paid = Number(watch('paid')) || 0;
  const due = total - paid;

  const onSubmit = async (data: CreateSales) => {
    if (!data.customerId) {
      handleAlert(false, 'Please select a customer');
      return;
    }

    if (items.length === 0) {
      handleAlert(false, 'Please select products');
      return;
    }

    const payload: CreateSales = {
      customerId: data.customerId,
      subtotal,
      discount: discountAmount,
      paid,
      total,
      paymentMethod: data.paymentMethod,
      items: items.map(item => ({
        productName: item.productName,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
    };
    try {
      const res = await createSale(payload).unwrap();
      if (!res) return;
      if (res.success) {
        setInvoice(res.data);
        setInvoiceOpen(true);
        setItems([]);
        reset();
      }
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    }
  };

  return (
    <>
      <section className="flex h-[calc(100vh-4.5rem)] gap-4 p-5">
        {/* Left */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {/* Search + Filter */}
          <Card className="hover:border-border! flex shrink-0 flex-col gap-2 md:gap-5 xl:flex-row">
            <SearchInput />

            <ProductsFilter />
          </Card>

          {/* Product Area */}
          <div className="min-h-0 flex-1 overflow-y-auto scrollbar-none">
            {isLoading ? (
              <Loading />
            ) : PRODUCTS.length === 0 ? (
              <p>Product Not Found</p>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-1 xl:grid-cols-4">
                {PRODUCTS.map(item => {
                  const outOfStock = Number(item.stock) === 0;
                  const isSelected = items.find(i => i.productId === item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleAdd(item)}
                      className={clsx(
                        outOfStock
                          ? styles.productCardOutOfStock
                          : styles.productCard,
                        isSelected && 'border-primary',
                      )}
                    >
                      {/* Product Image */}
                      <div className="relative aspect-4/3 w-full overflow-hidden">
                        <Image
                          src={item.image.url}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className={clsx(
                            'object-cover',
                            outOfStock && 'grayscale',
                          )}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="p-3">
                        <p className="p12">
                          {item.category.name} • {item.brand.name}
                        </p>

                        <p className="line-clamp-1 text-text">{item.name}</p>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <span className="text-base font-semibold text-primary">
                            ৳ {item.sellingPrice}
                          </span>

                          <span className="p12">{item.stock} in stock</span>
                        </div>
                      </div>

                      {/* Out Of Stock */}
                      {outOfStock && (
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-danger bg-danger-bg px-2 py-1 p12 text-danger">
                          Out of stock
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Cart */}
        <aside className="flex w-96 shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-surface">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col"
          >
            {/* Header */}
            <div className="shrink-0">
              <div className="flex items-center justify-between gap-3 border-b border-border p-4">
                <h4>Cart {items.length}</h4>

                <button type="button" className="cursor-pointer text-sm">
                  Create customer
                </button>

                <button
                  type="button"
                  onClick={clearCart}
                  className="cursor-pointer text-sm text-danger"
                >
                  Clear All
                </button>
              </div>

              {/* Customer */}
              <div className="p-4">
                <Select
                  placeholder="Select customer"
                  {...register('customerId', {
                    required: 'Customer is required',
                  })}
                  error={errors.customerId}
                >
                  <option value="" className={styles.option}>
                    Select customer
                  </option>

                  {customers.map(customer => (
                    <option
                      key={customer.id}
                      value={customer.id}
                      className={styles.option}
                    >
                      {customer.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Cart Items */}
            <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-accent-bg px-4">
              <ul className="flex flex-col gap-2">
                {items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-text/50">
                    <p className="p14">Cart is empty</p>

                    <p className="text-xs">Tap a product to add it here</p>
                  </div>
                ) : (
                  items.map(item => (
                    <li key={item.productId} className={styles.cartItem}>
                      {/* Item Header */}
                      <div className="flex items-start justify-between gap-2">
                        <p className="p14 truncate text-text">
                          {item.productName}
                        </p>

                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          aria-label="Remove"
                          className="cursor-pointer p-0.5"
                        >
                          <X size={14} className="text-danger!" />
                        </button>
                      </div>

                      {/* Quantity + Price */}
                      <div className="mt-2 flex items-center justify-between">
                        <div className={styles.qtyBtnWrap}>
                          <button
                            type="button"
                            onClick={() => changeQuantity(item.productId, -1)}
                            disabled={item.quantity === 1}
                            aria-label="Decrease quantity"
                            className={styles.btn}
                          >
                            <Minus size={14} />
                          </button>

                          <span className="p14 w-6 text-center text-text">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => changeQuantity(item.productId, +1)}
                            disabled={item.quantity >= item.stock!}
                            aria-label="Increase quantity"
                            className={styles.btn}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <span className="font-medium text-text">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Footer / Summary */}
            <div className="mt-3 ml-auto w-full px-4 pb-4">
              {/* Subtotal */}
              <div className={styles.summaryRow}>
                <span>Subtotal</span>

                <span>{formatPrice(subtotal)}</span>
              </div>

              {/* Discount */}
              <div className={styles.summaryRow}>
                <span className="w-1/2">Discount %</span>

                <Input
                  type="number"
                  min={0}
                  {...register('discount', {
                    valueAsNumber: true,
                    min: 0,
                  })}
                  className="w-1/2 text-right p12 px-2! py-1!"
                />
              </div>

              {/* Total */}
              <div className={clsx('text-sm text-success!', styles.summaryRow)}>
                <span>Total</span>

                <span>{formatPrice(total)}</span>
              </div>

              {/* paid */}
              <div className={styles.summaryRow}>
                <span className="w-1/2">paid</span>

                <Input
                  type="number"
                  min={0}
                  {...register('paid', {
                    valueAsNumber: true,
                    min: 0,
                  })}
                  className="w-1/2 text-right p12 px-2! py-1!"
                />
              </div>

              <div
                className={clsx('text-warning! border-none', styles.summaryRow)}
              >
                <span className="">Due</span>
                <span>{formatPrice(due)}</span>
              </div>

              {/* Payment Method */}
              <Select
                placeholder="Select payment method"
                {...register('paymentMethod', {
                  required: 'Payment method is required',
                })}
              >
                {PAYMENT_METHODS.map(method => (
                  <option key={method} value={method} className={styles.option}>
                    {method}
                  </option>
                ))}
              </Select>

              <Button
                type="submit"
                disabled={saleLoading}
                loading={saleLoading}
                className="mt-3 w-full"
              >
                Submit
              </Button>
            </div>
          </form>
        </aside>
      </section>

      <SaleInvoice
        invoice={invoice}
        open={invoiceOpen}
        setOpen={setInvoiceOpen}
        setInvoice={setInvoice}
      />
    </>
  );
};

export default PosSales;
