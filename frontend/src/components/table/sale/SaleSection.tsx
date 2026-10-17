'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SaleTable from './SaleTable';
import Pagination from '../Pagination';
import SaleDetailsPanel from './SaleDetailsPanel';
import { useAllSaleQuery } from '@/redux/feature/SaleSlice';

const SaleSection = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';

  const { data: saleData, isLoading } = useAllSaleQuery({
    page,
    search,
  });

  const SALES = saleData?.data.sales ?? [];
  const TOTAL_PAGE = saleData?.data.totalPage ?? 0;
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
  const selectedSale = SALES.find(p => p.id === selectedSaleId) ?? null;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <SaleTable Sales={SALES} setSelectedSaleId={setSelectedSaleId} />

      <SaleDetailsPanel setSales={setSelectedSaleId} sales={selectedSale} />
      {!isLoading && <Pagination total={TOTAL_PAGE} />}
    </div>
  );
};

export default SaleSection;
