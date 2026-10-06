'use client';

import Select from '@/components/ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const TYPE = [
  {
    name: 'All',
    slug: 'all',
  },
  {
    name: 'Customer',
    slug: 'customer',
  },
  {
    name: 'Supplier',
    slug: 'supplier',
  },
];

const ReturnTypeFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const handleFilter = (key: string, value: string) => {
    if (!value || value === 'all') {
      params.delete(key);
    } else {
      params.set('page', '1');
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };


  return (
    <div className="w-full md:max-w-[20%]">
      <Select
        value={searchParams.get('party') || 'all'}
        onChange={e => handleFilter('party', e.target.value)}
        className="py-2.5 text-sm text-text-muted "
      >
        {TYPE.map((item, index) => (
          <option key={index} className="bg-surface" value={item.slug}>
            {item.name}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default ReturnTypeFilter;
