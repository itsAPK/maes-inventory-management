import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, Edit } from 'lucide-react';
import React from 'react';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PurchaseSchema } from '@/schema/purchase';
import { BaseSchema } from '@/types';
import { Customer } from '../../customers/table';
import { Product } from '../../product/list/columns';

import { Purchase } from '../../purchase/list/columns';
import { ViewProducts } from '../../purchase/view-products';
import { ViewSales } from '../view-sales';
import { SalesInvoice } from '../invoice';
import { EditSales } from '../edit-sales';
import { Badge } from '@/components/ui/badge';
import { PaymentStatus } from '../payment-status';
import { SalesStatus } from '../sales-status';
import { UpdateRemainingAmount } from '../update-remaining-amount';

export const salesReportColumns = (): ColumnDef<Purchase>[] => {
  return [
    {
      accessorKey: 'date',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
      cell: ({ cell }) => new Date(cell.getValue() as any).toLocaleDateString(),
    },
    {
      accessorKey: 'reference',
      header: ({ column }) => <div className="text-center text-xs text-primary">Bill No.</div>,
      cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
      accessorKey: 'voucher_number',
      header: () => <div className="text-center text-xs text-primary">Voucher No.</div>,
    },
    {
      accessorKey: 'customer',
      header: () => <div className="text-center text-xs text-primary">Customer</div>,
    },

    {
      accessorKey: 'billed_quantity',
      header: ({ column }) => {
        return <DataTableColumnHeader className="px-1" column={column} title="Quantity" />;
      },
    },
    {
      accessorKey: 'payment_status',
      header: ({ column }) => {
        return <div className="text-center text-xs text-primary">Payment Status</div>;
      },
      cell: ({ cell, row }) => <PaymentStatus data={row.original} />,
    },
    {
      accessorKey: 'sales_status',
      header: ({ column }) => {
        return <div className="text-center text-xs text-primary">Sales Status</div>;
      },
      cell: ({ cell, row }) => <SalesStatus data={row.original} />,
    },
    {
      accessorKey: 'gstin_uin',
      header: ({ column }) => {
        return <div className="text-center text-xs text-primary">GSTIN/UIN.</div>;
      },
      cell: ({ cell }) => `${cell.getValue()}`,
    },
    {
      accessorKey: 'remaining_amount',
      header: ({ column }) => {
        return <DataTableColumnHeader className="px-1" column={column} title="Remaining Payment" />;
      },
      cell: ({ cell, row }) => <UpdateRemainingAmount data={row.original} />,
    },
    {
      accessorKey: 'total_amount',
      header: ({ column }) => {
        return <DataTableColumnHeader className="px-1" column={column} title="Total Amount" />;
      },
      cell: ({ cell }) => (cell.getValue() ? `₹${Number(cell.getValue()).toFixed(2)}` : 'N/A'),
    },

    {
      id: 'actions',
      cell: function Cell({ row }) {
        return (
          <>
            <div className="flex justify-end space-x-2 pl-2">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button className="rounded-[4px] text-xs" variant="ghost-1" size={'xs'}>
                    <div className="px-2 text-start text-xs"> Action </div>{' '}
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <ViewSales sales={row.original} />
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <ViewProducts product={row.original.products} />
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <EditSales data={row.original} />
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <SalesInvoice sales={row.original} />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        );
      },
    },
  ];
};
