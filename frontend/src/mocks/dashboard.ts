export const dashboardOverviewData = {
  labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
  sales: [0, 0, 0, 0, 334000, 6791500],
  purchases: [0, 0, 0, 0, 2600000, 5190000],
  revenue: [0, 0, 0, 0, 304000, 5000],

  salesByCategory: [
    { label: 'Smartphone', value: 39.3 },
    { label: 'Laptop', value: 30.4 },
    { label: 'Hafu', value: 30.3 },
  ],

  paymentMethods: [
    { label: 'CASH', value: 125000 },
    { label: 'BANK_TRANSFER', value: 110000 },
    { label: 'BKASH', value: 50000 },
    { label: 'CARD', value: 24000 },
  ],
};

export const dashboardCards = {
  range: 'today',
  cards: {
    totalSales: { value: 1842500, change: 12.5 },
    totalPurchases: { value: 1250000, change: 8.2 },
    grossProfit: { value: 592500, change: -15.3 },
    netProfit: { value: 287300, change: -3.1 },
  },
  stats: {
    totalProducts: 7,
    stockValue: 7690000,
    lowStock: 0,
    outOfStock: 0,
    totalCustomers: 7,
    totalSuppliers: 4,
  },
};
