'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from '@/helpers/icon/icon';

type Props = {
  total: number;
  queryName?: string;
};

const VISIBLE = 5;
const Dots = () => (
  <li className="flex h-8 w-8 items-center justify-center text-text">...</li>
);

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

  const goTo = (page: number) => {
    router.push(`${pathname}?${query(queryName, page)}`);
  };

  const current = Number(currentPage);
  const start = Math.max(1, Math.min(current - 2, total - VISIBLE + 1));
  const end = Math.min(total, start + VISIBLE - 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const arrowClass =
    'flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-text';

  return (
    <div className="flex items-center justify-end md:justify-between px-5 py-4">
      <span className="p14 hidden md:block">Showing 1-{total}</span>
      <ul className="flex justify-center gap-2">
        <li>
          <button
            type="button"
            aria-label="Previous page"
            disabled={current <= 1}
            onClick={() => goTo(current - 1)}
            className={`${arrowClass} cursor-pointer disabled:cursor-not-allowed disabled:opacity-40`}
          >
            <ChevronLeft size={16} />
          </button>
        </li>
        {start > 1 && <Dots />}
        {pages?.map(page => (
          <li
            key={page}
            onClick={() => goTo(page)}
            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-border ${
              current === page
                ? 'bg-primary text-btn-primary-text'
                : 'bg-surface text-text!'
            }`}
          >
            {page}
          </li>
        ))}
        {end < total && <Dots />}
        <li>
          <button
            type="button"
            aria-label="Next page"
            disabled={current >= total}
            onClick={() => goTo(current + 1)}
            className={`${arrowClass} cursor-pointer disabled:cursor-not-allowed disabled:opacity-40`}
          >
            <ChevronRight size={16} />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
