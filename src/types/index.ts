export type SearchParams = Record<string, string | string[] | undefined>;

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export interface DataTableFilterField<TData> {
  label: string;
  value: keyof TData;
  placeholder?: string;
  options?: Option[];
  dtype?: 'string' | 'int';
}

export interface DataTableFilterOption<TData> {
  id: string;
  label: string;
  value: keyof TData;
  options: Option[];
  filterValues?: string[];
  filterOperator?: string;
  isMulti?: boolean;
  dtype?: 'string' | 'int';
}

export interface IndexPageProps {
  searchParams: SearchParams;
}

export interface OverviewEntry {
  _id: {
    month: string;
  };
  count: number;
}

export interface CombinedOverviewEntry {
  month: string;
  sales: number;
  purchases: number;
}

export interface Stocks {
  month: string;
  stocks: number;
}

export interface CombinedStocks {
  month: string;
  opening: number;
  closing: number;
}

export type Transaction = {
  total_transaction_amount: number;
  date: string;
};

export interface DailyStocks {
  date: string;
  stocks: number;
}

export type DailyData = {
  date: string;
  sales: number;
  purchases: number;
};

export interface BaseSchema {
  updated_at: string;
  created_at: string;
  _id: string;
}
