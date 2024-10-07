'use client';
import * as React from 'react';
import type { DataTableFilterField, Option, SearchParams } from '@/types';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTableAdvancedToolbar } from '@/components/data-table/toolbar';
import { DataTable } from '@/components/data-table/data-table';

import { DataTableSkeleton } from '@/components/data-table/skeleton';
import { DownloadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Shell } from '@/components/ui/shell';
import { SalesReport, salesReportColumns } from './columns';
import { DateRangePicker } from '@/components/ui/date-range-picker';
export const SalesReportTable = ({
  data,
  pageCount,
}: {
  data: SalesReport[];
  pageCount: number;
}) => {
  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => salesReportColumns(), []);
  const filterFields: DataTableFilterField<SalesReport>[] = [
    {
      value: 'customer',
      label: 'Customer',
    },
    {
      label: 'Product Name',
      value: 'name',
    },
    {
      label: 'Sale Amount',
      value: 'sale_amount',
    },
    {
      label: 'Stock',
      value: 'stock',
    },
    {
      label: 'Sold',
      value: 'sold',
    },
    {
      label: 'Product Code.',
      value: 'product_code',
    },
  ];

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    enableAdvancedFilter: true,
    defaultPerPage: 50,
    defaultSort: 'date.desc',
  });
  return (
    <Shell className="gap-2">
      <DataTable table={table}>
        <DataTableAdvancedToolbar table={table} filterFields={filterFields}>
          <DateRangePicker triggerClassName="w-[300px]" placeholder="Select Date Range" />
          <Button variant="outline" size="sm">
            <DownloadIcon className="mr-2 size-4 shrink-0" aria-hidden="true" />
            Export
          </Button>
        </DataTableAdvancedToolbar>
      </DataTable>
    </Shell>
  );
};
