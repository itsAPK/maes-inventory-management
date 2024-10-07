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
import {
  productCategorySchema,
  ProductCategorySchema,
  ProductTypeSchema,
  productTypesSchema,
} from '@/schema/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { ProductCategory } from '@/app/product/category/page';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export const CreateProductType = ({ categories }: { categories: ProductCategory[] }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const form = useForm<ProductTypeSchema>({
    resolver: zodResolver(productTypesSchema),
  });

  const create = useMutation({
    mutationKey: ['create-product-type'],
    mutationFn: async (data: ProductTypeSchema) => {
      return await api
        .post(`/product/type`, data)
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
      queryClient.refetchQueries({ queryKey: ['get-product-type'] });
    },
  });

  const onSubmit = form.handleSubmit(async (data: ProductTypeSchema) => {
    await create.mutateAsync(data);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="rounded">
          Create Product Type
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Product Type</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="px-2 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter Product Type</FormLabel>
                    <FormControl>
                      <Input className="rounded shadow-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col space-y-2 pt-3">
                      <FormLabel>Select Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((i: ProductCategory) => (
                            <SelectItem key={i.id} value={i.id}>
                              {i.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
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
