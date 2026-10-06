import DetailsModel from '../DetailsModel';
import { Product } from '@/types/product.types';
import Image from 'next/image';
import InfoCard from '../InfoCard';
import formatDate from '@/helpers/formatDate';

type ProductDetailsPanelProps = {
  product: Product | null;
  setProduct: (product: Product | null) => void;
};

const ProductDetailsPanel = ({
  product,
  setProduct,
}: ProductDetailsPanelProps) => {
  const profitMargin = (() => {
    const sellingPrice = product?.sellingPrice || 1;
    const price = product?.price || 1;

    const profit = sellingPrice - price;

    const margin =
      sellingPrice > 0 ? Math.round((profit / sellingPrice) * 100) : 0;

    return { profit, margin };
  })();

  return (
    <DetailsModel
      label="Product Details"
      onClose={() => setProduct(null)}
      open={!!product}
    >
      <div className="space-y-3 p-6">
        {/* Product summary */}
        <div className="flex items-center gap-3">
          <div className="max-w-15 max-h-15 overflow-hidden rounded-md">
            <Image
              src={
                product?.image.url ||
                'https://res.cloudinary.com/dcoqpsz6e/image/upload/v1783296603/owsauvbpvo8k6g4nyo90.jpg'
              }
              alt={product?.image.public_id || ''}
              width={60}
              height={60}
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-xl line-clamp-1"> {product?.name}</h3>
            <p className=" p12"> Brand : {product?.brand.name}</p>
            <p className=" p12">Category : {product?.category.name} </p>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3">
          <InfoCard label="SKU" value={product?.sku || ''} />
          <InfoCard label="Barcode" value={product?.barcode || ''} />
          <InfoCard label="Price" value={product?.price || ''} />
          <InfoCard label="Selling Price" value={product?.sellingPrice || ''} />
          <InfoCard label="Current Stock" value={product?.stock || ''} />
          <InfoCard
            label="Min Stock Level"
            value={product?.minimumStockLevel || ''}
          />
        </div>
        <InfoCard label="Created" value={formatDate(product?.createdAt)} />

        {/* Profit margin */}
        <div className="rounded-lg border border-border bg-surface px-5 py-4">
          <p className="p12">Profit Margin</p>
          <div className="mt-1 flex items-end justify-between">
            <span className="text-2xl font-bold text-success">
              {profitMargin?.profit}
            </span>
            <span className="p14">
              per unit ({profitMargin?.margin} % margin)
            </span>
          </div>
        </div>
      </div>
    </DetailsModel>
  );
};


export default ProductDetailsPanel;
