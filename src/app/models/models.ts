export interface StockItem {
  id?: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  alertThreshold: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DateEvent {
  id?: string;
  title: string;
  startDate: string;
  endDate?: string;
  useTwoPeriods: boolean;
  createdAt?: string;
}

export interface DateCalculation {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}
