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
import { Input } from '@/components/ui/input';

interface UpdateRemainingAmountProps {
  data: Purchase;
  mode?: 'sales' | 'purchase';
}

export const UpdateRemainingAmount = ({ data, mode = 'sales' }: UpdateRemainingAmountProps) => {
  const [amount, setAmount] = useState<any>(data.remaining_amount);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const create = useMutation({
    mutationKey: ['update-purchase'],
    mutationFn: async () => {
      const response = [];

      for (const p of data.products) {
        const r = await api
          .patch(`/${mode}/${data.reference}/product/${p._id}`, { remaining_amount: amount })
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
    },
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div>₹{data.remaining_amount}</div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="flex space-x-3" onSelect={(e) => e.preventDefault()}>
          <Input value={amount} onChange={(e) => setAmount(e.target.value)} />
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
