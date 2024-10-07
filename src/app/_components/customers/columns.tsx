import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, EditIcon, TrashIcon } from 'lucide-react';
import React from 'react';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Customer } from './table';
import { DeleteCustomer } from './delete-customer';
import { EditCustomer } from './edit-customer';

export const customerColumns = (): ColumnDef<Customer>[] => {
  return [
    {
      accessorKey: 'customer_name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Customer Name" />,
    },

    {
      accessorKey: 'customer_alias',
      header: () => <div className="text-center text-xs text-primary">Alias</div>,
      cell: ({ cell }) => (cell.getValue() && cell.getValue() !== 0 ? cell.getValue() : 'N/A'),
    },
    {
      accessorKey: 'email',
      header: () => <div className="text-center text-xs text-primary">Email</div>,
      cell: ({ cell }) => (cell.getValue() && cell.getValue() !== '' ? cell.getValue() : 'N/A'),
    },
    {
      accessorKey: 'mobile_number',
      header: ({ column }) => {
        return <div className="text-center text-xs text-primary">Mobile No.</div>;
      },
      cell: ({ cell }) => (cell.getValue() && cell.getValue() !== '' ? cell.getValue() : 'N/A'),
    },
    {
      accessorKey: 'telephone_number',
      header: ({ column }) => {
        return <div className="text-center text-xs text-primary">Telephone No.</div>;
      },
      cell: ({ cell }) => (cell.getValue() && cell.getValue() !== 0 ? cell.getValue() : 'N/A'),
    },
    {
      accessorKey: 'fax_no',
      header: ({ column }) => {
        return <div className="text-center text-xs text-primary">Fax No.</div>;
      },
      cell: ({ cell }) => (cell.getValue() && cell.getValue() !== '' ? cell.getValue() : 'N/A'),
    },
    {
      accessorKey: 'group',
      header: ({ column }) => {
        return <DataTableColumnHeader className="px-1" column={column} title="Group" />;
      },
      cell: ({ cell }) => (cell.getValue() && cell.getValue() !== '' ? cell.getValue() : 'N/A'),
    },
    {
      accessorKey: 'state',
      header: ({ column }) => {
        return <DataTableColumnHeader className="px-1" column={column} title="State" />;
      },
      cell: ({ cell }) => (cell.getValue() && cell.getValue() !== '' ? cell.getValue() : 'N/A'),
    },

    {
      accessorKey: 'pincode',
      header: ({ column }) => {
        return <DataTableColumnHeader className="px-1" column={column} title="Pincode" />;
      },
      cell: ({ cell }) => `${cell.getValue()}`,
    },
    {
      accessorKey: 'customer_contact_person',
      header: ({ column }) => {
        return <DataTableColumnHeader className="px-1" column={column} title="Contact Person" />;
      },
      cell: ({ cell }) => (cell.getValue() && cell.getValue() !== '' ? cell.getValue() : 'N/A'),
    },
    // {
    //   accessorKey: "group",
    //   header: ({ column }) => {
    //     return (
    //       <DataTableColumnHeader
    //         className="px-1"
    //         column={column}
    //         title="Group"
    //       />
    //     );
    //   },
    //   cell: ({ cell }) => `${cell.getValue()}`,

    // },
    {
      accessorKey: 'address',
      header: ({ column }) => {
        return <DataTableColumnHeader className="px-1" column={column} title="Address" />;
      },
      cell: ({ cell }) => (cell.getValue() && cell.getValue() !== '' ? cell.getValue() : 'N/A'),
      size: 370, //set column size for this column
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
                    <EditCustomer data={row.original} />
                  </DropdownMenuItem>

                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <DeleteCustomer id={row.original._id} />
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
