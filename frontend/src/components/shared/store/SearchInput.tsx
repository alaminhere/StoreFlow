'use client';

import { useEffect, useState } from 'react';

import Input from '@/components/ui/input';
import { Search } from '@/helpers/icon/icon';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const SearchInput = ({ placeholder }: { placeholder?: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const [search, setSearch] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) {
        params.set('page', '1');
        params.set('search', search);
      } else {
        params.delete('search');
      }
      router.push(`${pathname}?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, pathname, router]);

  return (
    <div className="w-full relative">
      <Search
        className="text-text-muted text-sm left-3 absolute top-1/2 -translate-y-1/2 "
        size={16}
      />
      <Input
        value={search || ''}
        onChange={e => setSearch(e.target.value)}
        type="search"
        placeholder={placeholder || 'search products name or barcode'}
        className="w-full pl-10"
      />
    </div>
  );
};

export default SearchInput;
