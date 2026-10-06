'use client';

import Pagination from '../Pagination';
import MovementTable from './MovementTable';
import { useGetAllStockMovementQuery } from '@/redux/feature/movementSlice';
import { useSearchParams } from 'next/navigation';

const MovementSection = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const query = { page, search };

  const { data: movementData, isLoading } = useGetAllStockMovementQuery(query);

  const movement = movementData?.data?.movements ?? [];
  const totalPage = movementData?.data?.totalPage ?? 0;

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <MovementTable movement={movement} />

        {!isLoading && <Pagination total={totalPage} />}
      </div>
    </>
  );
};

export default MovementSection;
