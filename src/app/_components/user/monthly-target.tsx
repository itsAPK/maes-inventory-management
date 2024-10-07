import api from '@/lib/api';
import { MonthlyTargetSchema, monthlyTragetSchema, userSchema, UserSchema } from '@/schema/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AlertTriangle, Loader } from 'lucide-react';
import router from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  FormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const MonthlyTarget = () => {
  const [open, setOpen] = useState(false);

  const form = useForm<MonthlyTargetSchema>({
    resolver: zodResolver(monthlyTragetSchema),
    defaultValues: { target: '1500' },
  });
  const monthlyTarget = useQuery({
    queryKey: ['get-monthly-target'],
    queryFn: async (): Promise<any> => {
      return await api
        .post('/target/query', {
          query: [
            {
              $match: {
                year: String(new Date().getFullYear()),
                month: String(new Date().getMonth() + 1),
              },
            },
            {
              $sort: { updated_at: -1 },
            },
          ],
        })
        .then((res) => {
          if (!res.data.success) {
            throw new Error(res.data.message);
          }
          return res.data.data;
        })
        .catch((err) => {
          throw err;
        });
    },
  });
  const create = useMutation({
    mutationKey: ['monthly-target'],
    mutationFn: async (d: MonthlyTargetSchema) => {
      return await api
        .post(`/target`, {
          ...d,
          year: String(new Date().getFullYear()),
          month: String(new Date().getMonth() + 1),
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
    },
    onError: (error) => {
      toast.error(error.message, {
        icon: <AlertTriangle className="h-4 w-4" />,
      });
    },
    onSuccess: (data, variables, context) => {
      toast.success('Monthly Target is Updated', {
        icon: <AlertTriangle className="h-4 w-4" />,
      });
      setOpen(false);
    },
  });

  const onSubmit = form.handleSubmit(async (data: MonthlyTargetSchema) => {
    await create.mutateAsync(data);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex">
          <Button size="sm" className="rounded">
            {!monthlyTarget.isLoading ? (
              'Set Montly Target'
            ) : (
              <Loader className="h-4 w-4 animate-spin" />
            )}
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle> Montly Target</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6" onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Monthy Target</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <div className="flex justify-center px-3 pb-10 lg:justify-end">
                <Button
                  type="submit"
                  variant={'default'}
                  className="flex h-12 w-[250px] gap-2"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting && <Loader className="h-4 w-4 animate-spin" />}
                  <span>Submit</span>
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
