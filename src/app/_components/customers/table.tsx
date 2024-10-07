'use client';
import * as React from 'react';
import type { BaseSchema, DataTableFilterField } from '@/types';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTableAdvancedToolbar } from '@/components/data-table/toolbar';
import { DataTable } from '@/components/data-table/data-table';

import { Shell } from '@/components/ui/shell';
import { customerColumns } from './columns';
import { DateRange } from 'react-day-picker';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { ExportPurchase } from '@/app/_components/purchase/list/export';
import { CustomerSchema } from '@/schema/user';
import { ExportCustomer } from './export';
import { State } from 'country-state-city';

export interface Customer extends CustomerSchema, BaseSchema {}

export const CustomersTable = ({ data, pageCount }: { data: Customer[]; pageCount: number }) => {
  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => customerColumns(), []);
  const filterFields: DataTableFilterField<Customer>[] = [
    {
      value: 'customer_name',
      label: 'Customer Name',
    },
    {
      value: 'customer_alias',
      label: 'Alias',
    },
    {
      value: 'email',
      label: 'E-mail',
    },
    {
      value: 'address',
      label: 'Address',
    },
    {
      value: 'state',
      label: 'State',
      options: State.getStatesOfCountry('IN').map((i) => ({
        label: i.name,
        value: i.name,
      })),
    },

    {
      value: 'pincode',
      label: 'Pincode',
    },
    {
      value: 'group',
      label: 'Group',
    },
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
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [date, setDate] = React.useState<DateRange>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    to: new Date(),
  });

  return (
    <Shell className="gap-2">
      <DataTable table={table} size={'w-[150%]'}>
        <DataTableAdvancedToolbar table={table} filterFields={filterFields}>
          <ExportCustomer />
        </DataTableAdvancedToolbar>
      </DataTable>
    </Shell>
  );
};
