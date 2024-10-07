'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
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
import { AlertTriangle, Loader } from 'lucide-react';
import { ContentLayout } from '@/components/content-layout';
import api from '@/lib/api';
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { ProductCategory } from '../category/page';
import { ProductType } from '../product-types/page';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
export default function AddItem() {
  const form = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
  });

  const router = useRouter();

  const create = useMutation({
    mutationKey: ['create-product'],
    mutationFn: async (data: ProductSchema) => {
      return await api
        .post(`/product`, { ...data, total_amount: Number(data.rate) * Number(data.quantity) })
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
      toast.success('Product Created', {
        icon: <AlertTriangle className="h-4 w-4" />,
      });
      router.push('/product');
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
      },
    ],
  });

  return (
    <ContentLayout title={'Add Product'} tags={['products', 'new']}>
      <div className="shadow-form container relative mb-7 min-h-[120px] bg-white pt-10 shadow dark:bg-background">
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
      </div>
    </ContentLayout>
  );
}
