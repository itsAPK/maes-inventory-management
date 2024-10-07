import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import {
  FormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { ProductCategorySchema, ProductSchema, productSchema } from '@/schema/product';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Loader, EditIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from './list/columns';
import api from '@/lib/api';
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

import { toast } from 'sonner';
import { ProductCategory } from '@/app/product/category/page';
import { ProductType } from '@/app/product/product-types/page';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

interface EditProductProps {
  data: Product;
}

export const EditProduct = ({ data }: EditProductProps) => {
  const [open, setOpen] = useState(false);
  const form = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      alias: data.alias ?? undefined,
      batch: data.batch,
      brand_id: data.brand_id,
      category_id: data.category_id,
      description: data.description ?? undefined,
      discount: data.discount && data.discount !== '' ? String(data.discount) : undefined,
      godown: data.godown,
      group: data.group ?? undefined,
      hsn_code: data.hsn_code,
      name: data.name,
      notes: data.notes ?? undefined,
      product_code: data.product_code,
      product_type_id: data.product_type_id,
      purchase_rate: String(data.purchase_rate),
      quantity: String(data.quantity),
      rate: String(data.rate),
      rate_of_gst: String(data.rate_of_gst),
      unit: data.unit,
    },
  });

  const queryClient = useQueryClient();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const create = useMutation({
    mutationKey: ['update-product'],
    mutationFn: async (d: ProductSchema) => {
      return await api
        .patch(`/product/${data._id}`, {
          ...d,
          total_amount: Number(Number(d.rate) * Number(d.quantity)),
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
      form.reset();
      setOpen(false);
      const params = new URLSearchParams(searchParams.toString());
      router.push(`${pathname}?${params.toString()}`);
      router.refresh();
    },
  });

  const onSubmit = form.handleSubmit(async (data: ProductSchema) => {
    await create.mutateAsync(data);
  });

  const [categories, productTypes, brand] = useQueries({
    queries: [
      {
        queryKey: ['get-product-category'],
        queryFn: async (): Promise<any> => {
          return await api
            .get('/product/category')
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
        staleTime: Infinity,
      },
      {
        queryKey: ['get-product-type'],
        queryFn: async (): Promise<any> => {
          return await api
            .get('/product/type')
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
        staleTime: Infinity,
      },
      {
        queryKey: ['get-product-brand'],
        queryFn: async (): Promise<any> => {
          return await api
            .get('/product/brand')
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
        staleTime: Infinity,
      },
    ],
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex">
          <div className="mt-1">
            <EditIcon className="h-3 w-3" />
          </div>
          <div className="px-2">Edit</div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-[80%] overflow-y-auto sm:max-w-[70%]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="flex grid-cols-1 flex-col gap-6 md:grid md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Alias <span className="text-xs">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="product_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="group"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Group <span className="text-xs">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.data &&
                            categories.data.map((i: ProductCategory) => (
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
              <FormField
                control={form.control}
                name="brand_id"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col space-y-2 pt-3">
                      <FormLabel>Brand</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {brand.data &&
                            brand.data.map((i: ProductCategory) => (
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
              <FormField
                control={form.control}
                name="product_type_id"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col space-y-2 pt-2">
                      <FormLabel>Product Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {productTypes.data &&
                            productTypes.data.map((i: ProductType) => (
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
              <FormField
                control={form.control}
                name="hsn_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HSN Code</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      Description <span className="text-xs">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rate_of_gst"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rate of GST (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="godown"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Godown</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="batch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Batch <span className="text-xs">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rate</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="purchase_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Rate</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          'Piece', // For individual battery units
                          'Box', // For packaging multiple pieces
                          'Pallet', // For large shipments stacked on a pallet
                          'Kilogram', // For weight-based shipping or larger battery units
                          'Litre', // If batteries are shipped with electrolytes in liquid form
                          'Container', // For very large shipments in a container
                          'Dozen', // For sending batteries in sets of 12
                          'Pack', // For battery packs consisting of multiple cells
                          'Set',
                          'Nos',
                        ].map((i: string) => (
                          <SelectItem key={i} value={i}>
                            {i}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Discount (%) <span className="text-xs">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="total_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Amount</FormLabel>
                    <FormControl>
                      <Input disabled type="number" value={amount} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      Notes <span className="text-xs">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
