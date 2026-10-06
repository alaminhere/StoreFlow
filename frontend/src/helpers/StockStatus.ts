import { StockStatus } from '@/types/product.types';

const getStockStatus = (
  stock: number,
  minimumStockLevel: number,
): StockStatus => {
  if (stock <= 0) return 'Out of Stock';
  if (stock <= minimumStockLevel) return 'Low Stock';
  return 'In Stock';
};

export default getStockStatus;

export const statusStyles: Record<StockStatus, string> = {
  'In Stock': 'bg-success-bg text-success',
  'Low Stock': 'bg-warning-bg text-warning',
  'Out of Stock': 'bg-danger-bg text-danger',
};
