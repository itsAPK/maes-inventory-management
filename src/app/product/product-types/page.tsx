'use client';
import { CreateCategory } from '@/app/_components/product/category/create-category';
import { UpdateCategory } from '@/app/_components/product/category/update-category';
import { ContentLayout } from '@/components/content-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import api from '@/lib/api';
import { ProductCategorySchema } from '@/schema/product';
import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
import { AlertTriangle, EditIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ProductCategory } from '../category/page';
import { CreateProductType } from '@/app/_components/product/product-types/create-product-types';
import { UpdateProductType } from '@/app/_components/product/product-types/update-product-types';

export interface ProductType {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  category: {
    id: string;
    collection: string;
  };
}

export default function ProductTypes() {
  const [categories, productTypes] = useQueries({
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
    ],
  });

  const remove = useMutation({
    mutationKey: [`delete-product-type`],
    mutationFn: async (id: string) => {
      return await api
        .delete(`/product/type/${id}`)
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
      productTypes.refetch();
    },
  });

  return (
    <ContentLayout title="Product Types" tags={['product', 'product types']}>
      <div className="grid rounded bg-background px-4 py-10 shadow-sm">
        {!categories.isLoading && !productTypes.isLoading ? (
          <>
            <div className="flex justify-end">
              <CreateProductType categories={categories.data} />
            </div>
            <>
              {categories.data && productTypes.data && (
                <div className="grid gap-4 py-10">
                  {categories.data.map((category: ProductCategory) => {
                    // Filter product types by category
                    const associatedProductTypes = productTypes.data.filter(
                      (productType: ProductType) => productType.category.id === category.id,
                    );

                    // Only render the category if it has associated product types
                    if (associatedProductTypes.length === 0) return null;

                    return (
                      <div key={category.id}>
                        <p className="font-semibold text-muted-foreground">{category.name}</p>
                        <div className="flex flex-wrap justify-center gap-4 py-10 md:justify-start">
                          {associatedProductTypes.map((productType: ProductType) => (
                            <Card
                              key={productType.id}
                              className="min-w-[90%] px-0 py-2 md:min-w-[250px]"
                            >
                              <CardContent className="">
                                <div className="text-center text-sm font-semibold">
                                  <div className="py-1">{productType.name}</div>
                                </div>
                              </CardContent>
                              <CardFooter className="flex justify-center space-x-4">
                                <UpdateProductType
                                  categories={categories.data}
                                  productType={productType}
                                />
                                <Button
                                  className="inline-flex gap-3 rounded"
                                  size="sm"
                                  variant={'destructive'}
                                  onClick={async () => await remove.mutateAsync(productType.id)}
                                >
                                  {<TrashIcon className="h-4 w-4" />} Delete
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          </>
        ) : (
          <Loader />
        )}
      </div>
    </ContentLayout>
  );
}
