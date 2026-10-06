const formatPrice = (value: number) =>
  `৳ ${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

export default formatPrice;
