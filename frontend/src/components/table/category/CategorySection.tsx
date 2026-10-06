'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

import CategoryTable from './CategoryTable';

import BulkActionBar from '../BulkActionBar';
import Pagination from '../Pagination';

import CategoryForm from '@/components/shared/entity-forms/CategoryForm';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';
import handleAlert from '@/helpers/handleAlert';
import {
  useAllCategoryQuery,
  useDeleteCategoryMutation,
} from '@/redux/feature/categorySlice';
import { Category } from '@/types/Category.types';

const CategorySection = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page')) || 1;

  const [deleteCategory] = useDeleteCategoryMutation();

  //   categories with search and pagination
  const { data: categoryData, isLoading } = useAllCategoryQuery({
    search,
    page,
  });

  const CATEGORIES = categoryData?.data.categories ?? [];
  const totalPage = categoryData?.data.totalPage ?? 0;

  //  category edit form
  const [isEditFormOpen, setIsEditFormOpen] = useState<boolean>(false);
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] =
    useState<Category | null>(null);

  // manage brand selection for bulk actions
  const [selected, setSelected] = useState<string[]>([]);

  const allChecked =
    CATEGORIES.length > 0 && selected.length === CATEGORIES.length;

  const toggleAll = () => {
    setSelected(allChecked ? [] : CATEGORIES.map(category => category.id));
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
      const res = await deleteCategory({ ids }).unwrap();
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

      <CategoryForm
        categories={selectedCategoryForEdit}
        open={isEditFormOpen}
        setOpen={setIsEditFormOpen}
      />

      <CategoryTable
        brand={CATEGORIES}
        allChecked={allChecked}
        toggleAll={toggleAll}
        toggleOne={toggleOne}
        selected={selected}
        handleBulkDelete={handleBulkDelete}
        setIsEditFormOpen={setIsEditFormOpen}
        setSelectedCategoryForEdit={setSelectedCategoryForEdit}
      />

      {!isLoading && <Pagination total={totalPage} />}
    </div>
  );
};

export default CategorySection;
