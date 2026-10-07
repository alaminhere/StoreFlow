export const computeIsLowStock = (
  stock: number,
  minimumStockLevel: number,
): boolean => {
  return stock > 0 && stock <= minimumStockLevel;
};
