const getStockChange = (beforeStock: number, afterStock: number) => {
  const difference = afterStock - beforeStock;
  if (difference > 0) return `+${difference}`;
  if (difference < 0) return `${difference}`;
  return '0';
};

export default getStockChange;
