'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Props = {
  total: number;
  queryName?: string;
};

const Pagination = ({ total, queryName = 'page' }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = searchParams.get(queryName) || '1';

  const query = (name: string, value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, String(value));
    return params.toString();
  };

  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-end md:justify-between px-5 py-4">
      <span className="p14 hidden md:block">Showing 1-{total}</span>

      <ul className="flex justify-center gap-2">
        {pages?.map(page => (
          <li
            key={page}
            onClick={() => router.push(`${pathname}?${query(queryName, page)}`)}
            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-border ${
              Number(currentPage) === page
                ? 'bg-primary text-btn-primary-text'
                : 'bg-surface text-text!'
            }`}
          >
            {page}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pagination;
