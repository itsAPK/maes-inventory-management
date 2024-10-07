'use client';
import { CreateBrand } from '@/app/_components/product/brand/create-brand';
import { UpdateBrand } from '@/app/_components/product/brand/update-brand';
import { ContentLayout } from '@/components/content-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import api from '@/lib/api';
import { ProductCategorySchema } from '@/schema/product';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AlertTriangle, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

export interface ProductCategory extends ProductCategorySchema {
  id: string;
  created_at: Date | any;
  updated_at: Date | any;
}

export default function Brand() {
  const brand = useQuery({
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
  });

  const remove = useMutation({
    mutationKey: [`delete-brand`],
    mutationFn: async (id: string) => {
      return await api
        .delete(`/product/brand/${id}`)
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
      brand.refetch();
    },
  });

  return (
    <ContentLayout title="Brand" tags={['product', 'brand']}>
      <div className="grid rounded bg-background px-4 py-10 shadow-sm">
        <div className="flex justify-end">
          <CreateBrand />
        </div>
        {!brand.isLoading ? (
          <>
            {brand.data && (
              <div className="flex flex-wrap justify-center gap-4 py-10 md:justify-start">
                {brand.data.map((i: ProductCategory) => (
                  <Card className="min-w-[90%] px-0 pt-3 md:min-w-[250px]" key={i.id}>
                    <CardContent className="text-center text-sm font-semibold">
                      {i.name}
                    </CardContent>
                    <CardFooter className="flex justify-center space-x-4">
                      <UpdateBrand data={i} />
                      <Button
                        className="inline-flex gap-3 rounded"
                        size="sm"
                        variant={'destructive'}
                        onClick={async () => await remove.mutateAsync(i.id)}
                      >
                        {<TrashIcon className="h-4 w-4" />} Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}{' '}
          </>
        ) : (
          <Loader />
        )}
      </div>
    </ContentLayout>
  );
}
