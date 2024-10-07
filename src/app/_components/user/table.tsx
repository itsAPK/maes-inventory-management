'use client';
import * as React from 'react';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTableAdvancedToolbar } from '@/components/data-table/toolbar';
import { DataTable } from '@/components/data-table/data-table';

import { Shell } from '@/components/ui/shell';
import { User, userColumns } from './columns';
import { DateRange } from 'react-day-picker';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { UserSchema } from '@/schema/user';

export const UserTable = ({ data, pageCount }: { data: User[]; pageCount: number }) => {
  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => userColumns(), []);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    enableAdvancedFilter: false,
  });

  return (
    <Shell className="gap-2">
      <DataTable table={table} size={'w-[150%]'} pagination={false}></DataTable>
    </Shell>
  );
};
