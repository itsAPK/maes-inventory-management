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
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { AlertTriangle, Loader } from 'lucide-react';

interface PaymentStatusProps {
  data: Purchase;
  mode?: 'sales' | 'purchase';
}

export const PaymentStatus = ({ data, mode = 'sales' }: PaymentStatusProps) => {
  const [status, setStatus] = useState(data.payment_status);

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
            payment_status: status,
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
      toast.success('Payment Status Updated', {
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
          {data.payment_status ? (
            <Badge
              variant={
                data.payment_status === 'Partial'
                  ? 'default'
                  : data.payment_status === 'Paid'
                    ? 'success'
                    : 'destructive'
              }
              className="text-xs"
            >
              {data.payment_status as any}{' '}
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
          <Checkbox checked={status === 'Partial'} onClick={(e) => setStatus('Partial')} />
          <div>Partial</div>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex space-x-3" onSelect={(e) => e.preventDefault()}>
          {' '}
          <Checkbox checked={status === 'Paid'} onClick={(e) => setStatus('Paid')} />
          <div>Paid</div>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex space-x-3" onSelect={(e) => e.preventDefault()}>
          {' '}
          <Checkbox checked={status === 'Unpaid'} onClick={(e) => setStatus('Unpaid')} />
          <div>Unpaid</div>
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
