'use client'

import Avatar from '@/components/shared/Avatar';
import DetailsModel from '../DetailsModel';
import { useProductSupplierQuery } from '@/redux/feature/productSlice';
import { MapPin, Phone, Email, } from '@/helpers/icon/icon';
import Link from 'next/link';

type Props = {
  productId: string | null;
  setProductId: (id: string | null) => void;
};

const ProductSupplierDetailsPanel = ({
  productId,
  setProductId,
}: Props) => {
  const { data, isLoading } = useProductSupplierQuery(
    { id: productId! },
    { skip: !productId },
  );
  const suppliers = data?.data.suppliers
  console.log(suppliers, isLoading)

  return (
    <DetailsModel
      label="Product Suppliers"
      onClose={() => setProductId(null)}
      open={!!productId}
    >
      <div className="space-y-3 p-6">
        {suppliers?.map((s) => (
          <div
            key={s.id}
            className="rounded-md border border-border p-3"

          >
            <div className="flex items-start justify-between gap-2 border-b pb-3 mb-3 border-border">
              <Avatar className="" name={s.name} details={s.shopName} />
              <span className="text-success p12">
                {s.id}
              </span>
            </div>

            <ul className="space-y-1 p12 ">
              <li className="flex items-center gap-2">
                <Phone size={12} className='text-text-muted!' />
                <Link href={`tel:${s.phone}`} className="truncate hover:text-primary">
                  {s.phone}
                </Link>
              </li>

              <li className="flex items-center gap-2">
                <Email size={12} className='text-text-muted!' />
                <Link href={`mailto:${s.email}`} className="truncate hover:text-primary">
                  {s.email}
                </Link>
              </li>

              <li className="flex items-start gap-2">
                <MapPin size={12} className='text-text-muted! mt-1' />
                <span>{s.address}</span>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </DetailsModel>
  );
};


export default ProductSupplierDetailsPanel;
