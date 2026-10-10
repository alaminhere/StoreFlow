'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import Select from '@/components/ui/select';
import { useBrandListQuery } from '@/redux/feature/brandSlice';
import { useCategoryListQuery } from '@/redux/feature/categorySlice';

const STOCK = [
  {
    name: 'All Stock',
    slug: 'all',
  },
  {
    name: 'In Stock',
    slug: 'in-stock',
  },
  {
    name: 'Low Stock',
    slug: 'low-stock',
  },
  {
    name: 'Out of Stock',
    slug: 'out-of-stock',
  },
];

const ProductsFilter = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: brand } = useBrandListQuery();
  const { data: category } = useCategoryListQuery();

  const CATEGORY = category?.data ?? [];
  const BRAND = brand?.data ?? [];

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === 'all') {
      params.delete(key);
    } else {
      params.set('page', '1');
      params.set(key, value);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="grid w-full grid-cols-2 gap-2.5 md:grid-cols-3 xl:w-[60%]">
      <Select
        value={searchParams.get('stock') || 'all'}
        onChange={e => handleFilter('stock', e.target.value)}
        className="py-2.5 text-sm text-text-muted"
      >
        {STOCK.map((item, index) => (
          <option key={index} className="bg-surface" value={item.slug}>
            {item.name}
          </option>
        ))}
      </Select>
      <Select
        value={searchParams.get('category') || 'all'}
        onChange={e => handleFilter('category', e.target.value)}
        className="py-2.5 text-sm text-text-muted"
      >
        <option value="all">All Category</option>

        {CATEGORY.map((item, index) => (
          <option key={index} className="bg-surface" value={item.slug}>
            {item.name}
          </option>
        ))}
      </Select>
      <Select
        value={searchParams.get('brand') || 'all'}
        onChange={e => handleFilter('brand', e.target.value)}
        className="py-2.5 text-sm text-text-muted"
      >
        <option value="all">All Brand</option>
        {BRAND.map((item, index) => (
          <option key={index} className="bg-surface" value={item.slug}>
            {item.name}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default ProductsFilter;
