'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { productCategorySchema, ProductCategorySchema } from '@/schema/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
export const CreateBrand = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const form = useForm<ProductCategorySchema>({
    resolver: zodResolver(productCategorySchema),
  });

  const create = useMutation({
    mutationKey: ['create-product-brand'],
    mutationFn: async (data: ProductCategorySchema) => {
      return await api
        .post(`/product/brand`, data)
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
      form.reset();
      setOpen(false);
      queryClient.refetchQueries({ queryKey: ['get-product-brand'] });
    },
  });

  const onSubmit = form.handleSubmit(async (data: ProductCategorySchema) => {
    await create.mutateAsync(data);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="rounded">
          Create Brand
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Brand</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="px-2 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter Brand Name</FormLabel>
                    <FormControl>
                      <Input className="rounded shadow-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                variant={'default'}
                className="flex gap-2 px-10"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && create.isPending && (
                  <Loader className="h-4 w-4 animate-spin" />
                )}
                <span>Save</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
