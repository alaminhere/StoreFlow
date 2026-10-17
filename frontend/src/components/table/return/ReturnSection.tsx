'use client';

import ReturnTable from './ReturnTable';
import Pagination from '../Pagination';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Return } from '@/types/return.types';
import { useAllReturnQuery } from '@/redux/feature/returnSlice';
import ReturnDetailsPanel from './ReturnDetailsPanel';

const ReturnSection = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const party = searchParams.get('party') || '';
  const query = { page, party, search };

  const [selectedForDetails, setSelectedForDetails] = useState<Return | null>(
    null,
  );
  const { data: returnData, isLoading } = useAllReturnQuery(query);

  const RETURN = returnData?.data.returns ?? [];
  const totalPage = returnData?.data.totalPage ?? 1;

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <ReturnTable
          returnData={RETURN}
          setSelectedForDetails={setSelectedForDetails}
        />
        <ReturnDetailsPanel
          returnData={selectedForDetails}
          setReturnData={setSelectedForDetails}
        />
        {!isLoading && <Pagination total={totalPage} />}
      </div>
    </>
  );
};

export default ReturnSection;
