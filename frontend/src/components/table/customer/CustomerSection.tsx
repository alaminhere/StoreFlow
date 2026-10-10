'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

import Pagination from '../Pagination';
import CustomerTable from './CustomerTable';
import BulkActionBar from '../BulkActionBar';
import CustomerDetailsPanel from './CustomerDetailsPanel';

import CustomerForm from '@/components/shared/entity-forms/CustomerForm';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';
import handleAlert from '@/helpers/handleAlert';
import {
  useAllCustomerQuery,
  useDeleteCustomersMutation,
} from '@/redux/feature/customerSlice';
import { Customer } from '@/types/customer.types';

const CustomerSection = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';

  const [deleteCustomers] = useDeleteCustomersMutation();
  const { data: customerDAta, isLoading } = useAllCustomerQuery({
    page,
    search,
  });

  const CUSTOMER = customerDAta?.data.customers ?? [];
  const totalPage = customerDAta?.data.totalPage ?? 0;

  // manage customer edit form
  const [isEditFormOpen, setIsEditFormOpen] = useState<boolean>(false);
  const [selectedForEdit, setSelectedForEdit] = useState<Customer | null>(null);
  const [selectedForDetails, setSelectedForDetails] = useState<Customer | null>(
    null,
  );
  const [selectedForDelete, setSelectedForDelete] = useState<string[]>([]);

  const allChecked =
    CUSTOMER.length > 0 && selectedForDelete.length === CUSTOMER.length;

  const toggleAll = () => {
    setSelectedForDelete(allChecked ? [] : CUSTOMER.map(c => c.id));
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
      const res = await deleteCustomers({ ids }).unwrap();
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
        count={selectedForDelete.length}
        onClear={clearSelection}
        onDelete={handleBulkDelete}
      />

      <CustomerForm
        customer={selectedForEdit}
        open={isEditFormOpen}
        setOpen={setIsEditFormOpen}
      />

      <CustomerTable
        customer={CUSTOMER}
        allChecked={allChecked}
        toggleAll={toggleAll}
        toggleOne={toggleOne}
        handleBulkDelete={handleBulkDelete}
        selected={selectedForDelete}
        setIsEditFormOpen={setIsEditFormOpen}
        setSelectedForDetails={setSelectedForDetails}
        setSelectedForEdit={setSelectedForEdit}
      />

      {!isLoading && <Pagination total={totalPage} />}

      <CustomerDetailsPanel
        setCustomer={setSelectedForDetails}
        customer={selectedForDetails}
      />
    </div>
  );
};

export default CustomerSection;
