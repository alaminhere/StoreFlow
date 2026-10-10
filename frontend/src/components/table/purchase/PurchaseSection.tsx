'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

import Pagination from '../Pagination';
import PurchasesTable from './PurchaseTable';
import PurchasesDetailsPanel from './PurchaseDetailsPanel';

import { useAllPurchaseQuery } from '@/redux/feature/purchaseSlice'; 

const PurchaseSection = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const search = searchParams.get('search') || '';

  // fetch purchases with search and pagination and delete purchase mutation
  const { data: purchaseData, isLoading } = useAllPurchaseQuery({
    page,
    search,
  });

  const PURCHASES = purchaseData?.data.purchase ?? [];
  const totalPage = purchaseData?.data.totalPage ?? 0;
  // manage selected purchase for details panel

  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string | null>(
    null,
  );
  const selectedPurchase =
    PURCHASES.find(p => p.id === selectedPurchaseId) ?? null;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <PurchasesTable
        purchases={PURCHASES}
        setSelectedPurchaseId={setSelectedPurchaseId}
      />
      <PurchasesDetailsPanel
        setPurchase={setSelectedPurchaseId}
        purchase={selectedPurchase}
      />
      {!isLoading && <Pagination total={totalPage} />}
    </div>
  );
};

export default PurchaseSection;
