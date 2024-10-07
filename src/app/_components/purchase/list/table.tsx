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
import { Purchase, purchaseReportColumns } from './columns';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { CalendarDatePicker } from '@/components/calendar-date-picker';
import { DateRange } from 'react-day-picker';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { ExportPurchase } from './export';

export const PurchasesTable = ({ data, pageCount }: { data: Purchase[]; pageCount: number }) => {
  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => purchaseReportColumns(), []);
  const filterFields: DataTableFilterField<Purchase>[] = [
    {
      value: 'voucher_number',
      label: 'Vochure No.',
    },
    {
      label: 'Bill No.',
      value: 'reference',
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
          <CalendarDatePicker
            date={date}
            onDateSelect={({ from, to }) => {
              setDate({ from, to });
              const params = new URLSearchParams(searchParams.toString());

              params.set('from', from!.toISOString());
              params.set('to', to!.toISOString());

              router.push(`${pathname}?${params.toString()}`, {
                scroll: false,
              });
            }}
            className="h-8"
          />
          <ExportPurchase />
        </DataTableAdvancedToolbar>
      </DataTable>
    </Shell>
  );
};
