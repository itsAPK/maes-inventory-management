'use client';
import { Badge } from '@/components/ui/badge';
import { Purchase } from '../purchase/list/columns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { AlertTriangle, Loader } from 'lucide-react';

interface SalesStatusProps {
  data: Purchase;
  mode?: 'sales' | 'purchase';
}

export const SalesStatus = ({ data, mode = 'sales' }: SalesStatusProps) => {
  const [status, setStatus] = useState(data.sales_status);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const create = useMutation({
    mutationKey: ['update-purchase'],
    mutationFn: async () => {
      const response = [];

      for (const p of data.products) {
        const r = await api
          .patch(`/${mode}?reference_id=${data.reference}&product_id=${p._id}`, {
            sales_status: status,
          })
          .then((res) => {
            if (!res.data.success) {
              throw new Error(res.data.message);
            }
            return res.data;
          })
          .catch((err) => {
            throw err;
          });

        response.push(r.data);
      }

      return response;
    },
    onError: (error) => {
      toast.error(error.message, {
        icon: <AlertTriangle className="h-4 w-4" />,
      });
    },
    onSuccess: (data, variables, context) => {
      toast.success('Status Updated', {
        icon: <AlertTriangle className="h-4 w-4" />,
      });
      router.push(`${pathname}?${searchParams.toString()}`);
      router.refresh();
    },
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div>
          {data.sales_status ? (
            <Badge
              variant={
                data.sales_status === 'Incompleted'
                  ? 'destructive'
                  : data.sales_status === 'Completed'
                    ? 'success'
                    : 'default'
              }
              className="text-xs"
            >
              {data.sales_status as any}{' '}
            </Badge>
          ) : (
            <Badge variant={'outline'} className="text-xs">
              N/A
            </Badge>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="flex space-x-3" onSelect={(e) => e.preventDefault()}>
          <Checkbox checked={status === 'Completed'} onClick={(e) => setStatus('Completed')} />
          <div>Completed</div>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex space-x-3" onSelect={(e) => e.preventDefault()}>
          {' '}
          <Checkbox checked={status === 'Incompleted'} onClick={(e) => setStatus('Incompleted')} />
          <div>Incompleted</div>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex space-x-3" onSelect={(e) => e.preventDefault()}>
          {' '}
          <Checkbox checked={status === 'Drafts'} onClick={(e) => setStatus('Drafts')} />
          <div>Drafts</div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex space-x-3" onSelect={(e) => e.preventDefault()}>
          <Button
            variant={'default'}
            size="sm"
            className="w-full"
            disabled={create.isPending}
            onClick={async () => await create.mutateAsync()}
          >
            {create.isPending && <Loader className="h-4 w-4 animate-spin" />}
            Submit
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
