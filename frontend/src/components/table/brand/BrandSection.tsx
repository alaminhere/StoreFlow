'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

import BrandTable from './BrandTable';
import BulkActionBar from '../BulkActionBar';
import Pagination from '../Pagination';

import handleAlert from '@/helpers/handleAlert';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';
import BrandForm from '@/components/shared/entity-forms/BrandForm';

import {
  useAllBrandQuery,
  useDeleteBrandsMutation,
} from '@/redux/feature/brandSlice';
import { Brand } from '@/types/brand.types';

const BrandSection = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page')) || 1;

  const [deleteBrands] = useDeleteBrandsMutation();

  // fetch brand with search and pagination
  const { data: brandData, isLoading } = useAllBrandQuery({
    search,
    page,
  });

  const BRANDS = brandData?.data.brands ?? [];
  const totalPage = brandData?.data.totalPage ?? 1;

  // manage brand edit form
  const [isEditFormOpen, setIsEditFormOpen] = useState<boolean>(false);
  const [selectedBrandForEdit, setSelectedBrandForEdit] =
    useState<Brand | null>(null);

  // manage brand selection for bulk actions
  const [selected, setSelected] = useState<string[]>([]);
  const allChecked = BRANDS.length > 0 && selected.length === BRANDS.length;
  const toggleAll = () => {
    setSelected(allChecked ? [] : BRANDS.map(brand => brand.id));
  };
  
  const toggleOne = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  };

  const clearSelection = () => setSelected([]);

  const handleBulkDelete = async (id?: string[]) => {
    const ids = Array.isArray(id) ? id : selected;

    try {
      const res = await deleteBrands({ ids }).unwrap();
      if (!res) return;

      handleAlert(res.success, res.message);
      clearSelection();
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <BulkActionBar
        count={selected.length}
        onClear={clearSelection}
        onDelete={handleBulkDelete}
      />

      <BrandForm
        brand={selectedBrandForEdit}
        open={isEditFormOpen}
        setOpen={setIsEditFormOpen}
      />

      <BrandTable
        brand={BRANDS}
        allChecked={allChecked}
        toggleAll={toggleAll}
        toggleOne={toggleOne}
        selected={selected}
        handleBulkDelete={handleBulkDelete}
        setIsEditFormOpen={setIsEditFormOpen}
        setSelectedBrandForEdit={setSelectedBrandForEdit}
      />

      {!isLoading && <Pagination total={totalPage} />}
    </div>
  );
};

export default BrandSection;
