// WHAT: Stock movement actions for recording stock in, stock out, damage, and returns

'use client';

import { useState } from 'react';

import PopupModal from '@/components/shared/PopupModal';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';

import getApiErrorMessage from '@/helpers/getApiErrorMessage';
import handleAlert from '@/helpers/handleAlert';
import { ArrowUpDown } from '@/helpers/icon/icon';

import { useProductListQuery } from '@/redux/feature/productSlice';
import { useCreateStockMovementMutation } from '@/redux/feature/movementSlice';

const MOVEMENT_VARIABLE = {
  STOCK_IN: {
    msg: 'Stock In stock will be increased',
    style: 'bg-success-bg text-success',
  },
  STOCK_OUT: {
    msg: 'Stock Out stock will be decreased',
    style: 'bg-accent-bg text-accent!',
  },
  DAMAGE: {
    msg: 'Damage stock will be decreased',
    style: 'bg-danger-bg text-danger!',
  },
  RETURN: {
    msg: 'Return stock will be increased',
    style: 'bg-background text-info!',
  },
};

type Movement = 'STOCK_IN' | 'STOCK_OUT' | 'DAMAGE' | 'RETURN';

const MovementsAction = () => {
  // WHAT: Manage stock movement modal state
  const [open, setOpen] = useState(false);

  // WHAT: Fetch products for stock movement selection
  const { data: productsData } = useProductListQuery();
  const PRODUCTS = productsData?.data ?? [];

  // WHAT: Handle stock movement creation
  const [createStockMovement, { isLoading }] = useCreateStockMovementMutation();

  // WHAT: Manage selected stock movement type
  const [movementType, setMovementType] = useState<Movement>('STOCK_IN');

  const MOVEMENT = MOVEMENT_VARIABLE[movementType];

  // WHAT: Manage selected product and current stock
  const [selectedProduct, setSelectedProduct] = useState({
    id: '',
    quantity: 0,
  });

  // WHAT: Submit stock movement form
  const handleSubmit = async (formData: FormData) => {
    const quantity = Number(formData.get('quantity'));
    const reason = formData.get('reason') as string;

    if (!selectedProduct.id.trim()) {
      handleAlert(false, 'Please select a product.');
      return;
    }
    if (!quantity || quantity <= 0) {
      handleAlert(false, 'Please enter a valid quantity.');
      return;
    }
    if (!reason?.trim()) {
      handleAlert(false, 'Please enter a reason.');
      return;
    }
    const payload = {
      productId: selectedProduct.id,
      quantity,
      type: movementType,
      reason: reason.trim(),
    };
    try {
      const res = await createStockMovement(payload).unwrap();
      if (res.success) {
        setOpen(false);
      }
      handleAlert(res.success, res.message);
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    }
  };

  return (
    <>
      {open && (
        <PopupModal
          className="max-w-xl!"
          onClose={() => setOpen(false)}
          label="Stock Movements"
        >
          <div
            className={`mb-4 w-full rounded-md px-3 py-2.5 text-sm font-medium ${MOVEMENT.style}`}
          >
            {MOVEMENT.msg}
          </div>

          <form action={handleSubmit} className="space-y-2">
            <Select
              onChange={e => {
                const product = PRODUCTS.find(
                  item => item.id === e.target.value,
                );

                setSelectedProduct({
                  id: product?.id ?? '',
                  quantity: product?.stock ?? 0,
                });
              }}
              className="py-2"
            >
              <option className="bg-surface">Select Product</option>

              {PRODUCTS.map(item => (
                <option key={item.id} className="bg-surface" value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>

            <div className="flex gap-2">
              <Input
                name="quantity"
                type="number"
                label="Quantity *"
                className="py-1.5!"
              />

              <Input
                type="number"
                label="Current Stock *"
                readOnly
                className="py-1.5!"
                value={selectedProduct?.quantity}
              />
            </div>

            <Input name="reason" label="Reason" className="py-1.5!" />

            <Button
              loading={isLoading}
              disabled={isLoading}
              type="submit"
              className="mt-6"
            >
              Record Movement
            </Button>
          </form>
        </PopupModal>
      )}

      <div className="my-5 flex flex-nowrap justify-start gap-5 overflow-x-auto">
        <Button
          onClick={() => {
            setMovementType('STOCK_IN');
            setOpen(true);
          }}
          variant="secondary"
          className={`border-none ${MOVEMENT_VARIABLE.STOCK_IN.style}`}
        >
          <ArrowUpDown size={14} className="text-success!" />
          Stock In
        </Button>

        <Button
          onClick={() => {
            setMovementType('STOCK_OUT');
            setOpen(true);
          }}
          variant="secondary"
          className={`border-none ${MOVEMENT_VARIABLE.STOCK_OUT.style}`}
        >
          <ArrowUpDown size={14} className="text-accent!" />
          Stock Out
        </Button>

        <Button
          onClick={() => {
            setMovementType('DAMAGE');
            setOpen(true);
          }}
          variant="secondary"
          className={`border-none ${MOVEMENT_VARIABLE.DAMAGE.style}`}
        >
          <ArrowUpDown size={14} className="text-danger!" />
          Damage
        </Button>

        <Button
          onClick={() => {
            setMovementType('RETURN');
            setOpen(true);
          }}
          variant="secondary"
          className={`border-none ${MOVEMENT_VARIABLE.RETURN.style}`}
        >
          <ArrowUpDown size={14} className="text-info!" />
          Return
        </Button>
      </div>
    </>
  );
};

export default MovementsAction;
