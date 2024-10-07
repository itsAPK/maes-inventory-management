'use client';
import * as React from 'react';
import type { DataTableFilterField } from '@/types';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTableAdvancedToolbar } from '@/components/data-table/toolbar';
import { DataTable } from '@/components/data-table/data-table';

import { Shell } from '@/components/ui/shell';
import { Product, productColumns } from './columns';
import { DateRange } from 'react-day-picker';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { ExportPurchase } from '@/app/_components/purchase/list/export';
import { ExportProduct } from './export';

export const ProductTable = ({ data, pageCount }: { data: Product[]; pageCount: number }) => {
  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => productColumns(), []);
  const filterFields: DataTableFilterField<Product>[] = [
    {
      value: 'name',
      label: 'Product Name',
    },
    {
      value: 'alias',
      label: 'Alias',
    },
    {
      value: 'product_code',
      label: 'Product Code',
    },
    {
      value: 'group',
      label: 'Group',
    },
    {
      value: 'category',
      label: 'Category',
    },
    {
      value: 'brand',
      label: 'Brand',
    },
    {
      value: 'product_type',
      label: 'Product Type',
    },
    {
      value: 'hsn_code',
      label: 'HSN Code',
    },
    {
      value: 'godown',
      label: 'Godown',
    },
    {
      value: 'batch',
      label: 'Batch',
    },
    {
      value: 'rate_of_gst',
      label: 'GST',
    },
    {
      value: 'quantity',
      label: 'Quantity',
      dtype: 'int',
    },
    {
      value: 'rate',
      label: 'Rate',
      dtype: 'int',
    },
    {
      value: 'purchase_rate',
      label: 'Purchase Rate',
      dtype: 'int',
    },
    // {
    //   value: 'total_amount',
    //   label: 'Amount',
    //   dtype: 'int',
    // },
  ];

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    enableAdvancedFilter: true,
    defaultPerPage: 50,
    defaultSort: 'created_at.desc',
  });

  return (
    <Shell className="gap-2">
      <DataTable table={table} size={'w-[150%]'}>
        <DataTableAdvancedToolbar table={table} filterFields={filterFields}>
          <ExportProduct />
        </DataTableAdvancedToolbar>
      </DataTable>
    </Shell>
  );
};
