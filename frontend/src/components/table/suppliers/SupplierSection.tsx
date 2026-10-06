'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

import BulkActionBar from '../BulkActionBar';
import Pagination from '../Pagination';

import getApiErrorMessage from '@/helpers/getApiErrorMessage';
import handleAlert from '@/helpers/handleAlert';
import SupplierForm from '@/components/shared/entity-forms/SupplierForm';

import SupplierDetailsPanel from './SupplierDetailsPanel';
import SupplierTable from './SupplierTable';

import {
  useAllSupplierQuery,
  useDeleteSuppliersMutation,
} from '@/redux/feature/supplierSlice';
import { Supplier } from '@/types/supplier.types';

const SuppliersSection = () => {
  //fetch suppliers with search and pagination
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';

  const { data, isLoading } = useAllSupplierQuery({
    page,
    search,
  });

  const SUPPLIER = data?.data.suppliers ?? [];
  const totalPage = data?.data.totalPage ?? 0;

  // manage supplier deletion
  const [deleteSuppliers] = useDeleteSuppliersMutation();

  //manage selected supplier for editing
  const [selectedForEdit, setSelectedForEdit] = useState<Supplier | null>(null);

  // manage selected supplier for details panel
  const [selectedForDetails, setSelectedForDetails] = useState<Supplier | null>(
    null,
  );

  // manage supplier edit form
  const [isEditFormOpen, setIsEditFormOpen] = useState<boolean>(false);

  // manage supplier selection for bulk actions
  const [selectedForDelete, setSelectedForDelete] = useState<string[]>([]);

  const allChecked =
    SUPPLIER.length > 0 && selectedForDelete.length === SUPPLIER.length;

  const toggleAll = () => {
    setSelectedForDelete(
      allChecked ? [] : SUPPLIER.map(category => category.id),
    );
  };

  const toggleOne = (id: string) => {
    setSelectedForDelete(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  };

  const clearSelection = () => setSelectedForDelete([]);
  const handleBulkDelete = async (id?: string[]) => {
    const ids = Array.isArray(id) ? id : selectedForDelete;

    try {
      const res = await deleteSuppliers({ ids }).unwrap();
      if (!res) return;

      handleAlert(res.success, res.message);
      clearSelection();
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      {/* Bulk Actions */}
      <BulkActionBar
        count={selectedForDelete.length}
        onClear={clearSelection}
        onDelete={handleBulkDelete}
      />

      {/* Supplier Form */}
      <SupplierForm
        supplier={selectedForEdit}
        open={isEditFormOpen}
        setOpen={setIsEditFormOpen}
      />

      {/* Supplier Table */}
      <SupplierTable
        supplier={SUPPLIER}
        allChecked={allChecked}
        toggleAll={toggleAll}
        toggleOne={toggleOne}
        handleBulkDelete={handleBulkDelete}
        selected={selectedForDelete}
        setIsEditFormOpen={setIsEditFormOpen}
        setSelectedForDetails={setSelectedForDetails}
        setSelectedForEdit={setSelectedForEdit}
      />

      {/* Pagination */}
      {!isLoading && <Pagination total={totalPage} />}

      {/* Supplier Details */}
      <SupplierDetailsPanel
        setSupplier={setSelectedForDetails}
        supplier={selectedForDetails}
      />
    </div>
  );
};

export default SuppliersSection;
