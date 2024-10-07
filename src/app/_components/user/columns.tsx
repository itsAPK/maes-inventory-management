import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { UserSchema } from '@/schema/user'; // Update the path accordingly
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { AlertTriangle, ArrowDown, EditIcon, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { DeleteUser } from './delete-user';
import { EditUser } from './edit-user';
import { BaseSchema } from '@/types';

export interface User extends UserSchema, BaseSchema {}

export const userColumns = (): ColumnDef<User>[] => {
  return [
    {
      accessorKey: 'full_name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    },
    {
      accessorKey: 'employee_id',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Employee ID" />,
    },
    {
      accessorKey: 'mobile',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Mobile" />,
      cell: ({ cell }) => cell.getValue()?.toString() || 'N/A',
    },
    {
      accessorKey: 'email',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    },
    {
      accessorKey: 'gender',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Gender" />,
    },
    {
      accessorKey: 'role',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    },
    {
      accessorKey: 'branch',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Branch" />,
      cell: ({ cell }) => cell.getValue()?.toString() || 'N/A',
    },
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
                  <EditUser data={row.original} />
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <DeleteUser id={row.original._id} />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
};
