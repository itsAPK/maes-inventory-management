import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown } from 'lucide-react';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProductSchema } from '@/schema/product'; // Ensure the path to the schema is correct
import { EditProduct } from '../edit-product';
import { BaseSchema } from '@/types';
import { DeleteProduct } from '../delete-product';

export interface Product extends ProductSchema, BaseSchema {
  brand: string;
  category: string;
  product_type: string;
  product_type_id: string;
  brand_id: string;
  category_id: string;
}

export const productColumns = (): ColumnDef<Product>[] => {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ cell }) => cell.getValue() ?? 'N/A',
    },
    {
      accessorKey: 'alias',
      header: () => <div className="text-center text-xs text-primary">Alias</div>,
      cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
      accessorKey: 'product_code',
      header: () => <div className="text-center text-xs text-primary">Product Code</div>,
      cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
      accessorKey: 'group',
      header: () => <div className="text-center text-xs text-primary">Group</div>,
      cell: ({ cell }: any) => cell.getValue().replace('_x0004_ ', '') || 'N/A',
    },
    {
      accessorKey: 'category',
      header: () => <div className="text-center text-xs text-primary">Category</div>,
      cell: ({ cell }) => cell.getValue() || 'N/A',
    },

    {
      accessorKey: 'brand',
      header: () => <div className="text-center text-xs text-primary">Brand</div>,
      cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
      accessorKey: 'product_type',
      header: () => <div className="text-center text-xs text-primary">Product Type</div>,
      cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
      accessorKey: 'description',
      header: () => <div className="text-center text-xs text-primary">Description</div>,
      cell: ({ cell }) => cell.getValue() || 'N/A',
      size: 470,
    },
    {
      accessorKey: 'hsn_code',
      header: () => <div className="text-center text-xs text-primary">HSN Code</div>,
      cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
      accessorKey: 'rate_of_gst',
      header: ({ column }) => <DataTableColumnHeader column={column} title="GST" />,
      cell: ({ cell }) => `${cell.getValue()}%`,
    },
    {
      accessorKey: 'godown',
      header: () => <div className="text-center text-xs text-primary">Godown</div>,
      cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
      accessorKey: 'unit',
      header: () => <div className="text-center text-xs text-primary">Unit</div>,
      cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
      accessorKey: 'quantity',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity" />,
      cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
      accessorKey: 'discount',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Discount" />,
      cell: ({ cell }) => (cell.getValue() ? `${cell.getValue()}%` : 'N/A'),
    },
    {
      accessorKey: 'purchase_rate',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Purchase Amount" />,
      cell: ({ cell }) => (cell.getValue() ? `₹${cell.getValue()}` : 'N/A'),
    },
    {
      accessorKey: 'rate',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
      cell: ({ cell }) => `₹${cell.getValue()}` || 'N/A',
    },
    // {
    //   accessorKey: 'total_amount',
    //   header: ({ column }) => <DataTableColumnHeader column={column} title="Total Amount" />,
    //   cell: ({ cell }) => `₹${Number(cell.getValue()).toFixed(2)}`,
    // },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        return (
          <div className="flex justify-end space-x-2 pl-2">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button className="rounded-[4px] text-xs" variant="ghost-1" size={'xs'}>
                  <div className="px-2 text-start text-xs">Action</div>
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <EditProduct data={row.original} />
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <DeleteProduct id={row.original._id} />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
};
