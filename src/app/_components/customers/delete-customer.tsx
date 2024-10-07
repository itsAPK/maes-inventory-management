'use client';
import api from '@/lib/api';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { AlertTriangle, TrashIcon } from 'lucide-react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface DeleteCustomerProps {
  id: string;
}

export const DeleteCustomer = ({ id }: DeleteCustomerProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const queryClient = useQueryClient();
  const deleteCustomer = useMutation({
    mutationKey: ['delete-customer'],
    mutationFn: async () => {
      return await api
        .delete(`/customer/${id}`)
        .then((res) => {
          if (!res.data.success) {
            throw new Error(res.data.message);
          }
          return res.data;
        })
        .catch((err) => {
          throw err;
        });
    },
    onError: (error) => {
      toast.error(error.message, {
        icon: <AlertTriangle className="h-4 w-4" />,
      });
    },
    onSuccess: (data, variables, context) => {},
  });
  return (
    <div
      className="flex space-x-2"
      onClick={async () => {
        await deleteCustomer.mutateAsync();

        const params = new URLSearchParams(searchParams.toString());
        router.push(`${pathname}?${params.toString()}`);
        router.refresh();
      }}
    >
      <div className="mt-1">
        <TrashIcon className="h-3 w-3" />
      </div>
      <div className="">Delete</div>
    </div>
  );
};
