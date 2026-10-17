
export type RangeKey =
  | 'today'
  | 'yesterday'
  | 'last7days'
  | 'last30days'
  | 'lastMonth'
  | 'thisYear';



export interface CategoryData {
  label: string;
  value: number;
}

export interface PaymentMethodData {
  label: string;
  value: number;
}

export interface DashboardOverviewData {
  labels: string[];
  sales: number[];
  purchases: number[];
  revenue: number[];
  salesByCategory: CategoryData[];
  paymentMethods: PaymentMethodData[];
}

export interface DashboardCardsData {
  range: string;
  cards: {
    totalSales: { value: number; change: number };
    totalPurchases: { value: number; change: number };
    grossProfit: { value: number; change: number };
    netProfit: { value: number; change: number };
  };
  stats: {
    totalProducts: number;
    stockValue: number;
    lowStock: number;
    outOfStock: number;
    totalCustomers: number;
    totalSuppliers: number;
  };
}