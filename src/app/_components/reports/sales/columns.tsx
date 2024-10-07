import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import React from 'react';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { Badge } from '@/components/ui/badge';

export interface SalesReport {
  date: Date;
  customer: string;
  name: string;
  product_code: string;
  stock: number;
  sold: number;
  sale_amount: number;
  status: string;
}

export const salesReportColumns = (): ColumnDef<SalesReport>[] => {
  return [
    {
      accessorKey: 'date',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
      cell: ({ cell }) => new Date(cell.getValue() as any).toLocaleDateString(),
    },

    {
      accessorKey: 'customer',
      header: () => <div className="text-center text-xs text-primary">Customer</div>,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Product Name" />;
      },
    },
    {
      accessorKey: 'product_code',
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Product Code" />;
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return <DataTableColumnHeader className="px-1" column={column} title="Status" />;
      },
      cell: ({ cell }) => (
        <Badge
          variant={
            cell.getValue() === 'Paid'
              ? 'success'
              : cell.getValue() === 'Unpaid'
                ? 'destructive'
                : 'default'
          }
        >
          {cell.getValue() as string}
        </Badge>
      ),
    },
    {
      accessorKey: 'stock',
      header: ({ column }) => {
        return <DataTableColumnHeader className="px-1" column={column} title="Stock Quantity" />;
      },
    },
    {
      accessorKey: 'sold',
      header: () => <div className="text-xs text-primary">Sold Qty</div>,
    },
    {
      accessorKey: 'sale_amount',
      header: () => <div className="text-xs text-primary">Sale Amount</div>,
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        return (
          <>
            <div className="flex justify-end space-x-2 pl-2">
              <Button className="rounded-[4px] text-xs" variant="ghost-1" size={'xs'}>
                <div className="text-start text-xs"> Action </div>
              </Button>
            </div>
          </>
        );
      },
    },
  ];
};
