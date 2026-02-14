export interface StockItem {
  id?: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  alertThreshold: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DateEvent {
  id?: string;
  title: string;
  period1Start: string;
  period1End?: string;
  period2Start?: string;
  useTwoPeriods: boolean;
  createdAt?: string;
}

export interface DateCalculation {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}
