'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

import BulkActionBar from '../BulkActionBar';
import Pagination from '../Pagination';

import ProductDetailsPanel from './ProductDetailsPanel';
import ProductTable from './ProductTable';
import StockMovementHistoryPanel from './StockMovementHistoryPanel';

import ProductForm from '@/components/shared/entity-forms/ProductForm';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';
import handleAlert from '@/helpers/handleAlert';

import {
  useAllProductQuery,
  useDeleteProductsMutation,
} from '@/redux/feature/productSlice';
import { Product } from '@/types/product.types';
import ProductSupplierDetailsPanel from './ProductSupplierDetailsPanel';

const ProductsSection = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const stock = searchParams.get('stock') || '';
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';

  const query = {
    page,
    search,
    stock,
    category,
    brand,
  };

  const { data: productData, isLoading } = useAllProductQuery(query);
  const [deleteProducts] = useDeleteProductsMutation();

  const PRODUCTS = productData?.data.Products ?? [];
  const TOTAL_PAGE = productData?.data.totalPage ?? 1;

  // manage selected product for details
  const [selectedProductForDetails, setSelectedProductForDetails] =
    useState<Product | null>(null);


  // manage select product id for product suppliers
  const [productIdForSupplier, setProductIdIdForSupplier] = useState<string | null>(null);

  // manage product edit form
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] =
    useState<Product | null>(null);

  // manage selected product for stock movement history
  const [productIdForHistory, setProductIdForHistory] = useState<string | null>(
    null,
  );

  // manage product selection for bulk actions
  const [selected, setSelected] = useState<string[]>([]);

  const allChecked = PRODUCTS.length > 0 && selected.length === PRODUCTS.length;

  const toggleAll = () => {
    setSelected(allChecked ? [] : PRODUCTS.map(product => product.id));
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
      const res = await deleteProducts({ ids }).unwrap();
      if (!res) return;
      handleAlert(res.success, res.message);
      clearSelection();
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <BulkActionBar
          count={selected.length}
          onClear={clearSelection}
          onDelete={handleBulkDelete}
        />

        <ProductForm
          product={selectedProductForEdit}
          open={isEditFormOpen}
          setOpen={setIsEditFormOpen}
        />

        <ProductTable
          products={PRODUCTS}
          selected={selected}
          allChecked={allChecked}
          toggleAll={toggleAll}
          toggleOne={toggleOne}
          handleBulkDelete={handleBulkDelete}
          setSelectedProductForDetails={setSelectedProductForDetails}
          setProductIdForHistory={setProductIdForHistory}
          setSelectedProductForEdit={setSelectedProductForEdit}
          setIsEditFormOpen={setIsEditFormOpen}
          setProductIdIdForSupplier={setProductIdIdForSupplier}
        />

        {!isLoading && <Pagination total={TOTAL_PAGE} />}

        <ProductDetailsPanel
          product={selectedProductForDetails}
          setProduct={setSelectedProductForDetails}
        />
        <ProductSupplierDetailsPanel
          productId={productIdForSupplier}
          setProductId={setProductIdIdForSupplier}
        />

        <StockMovementHistoryPanel
          id={productIdForHistory}
          setId={setProductIdForHistory}
        />
      </div>
    </>
  );
};

export default ProductsSection;
