'use client';
import { CreateCategory } from '@/app/_components/product/category/create-category';
import { UpdateCategory } from '@/app/_components/product/category/update-category';
import { ContentLayout } from '@/components/content-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import api from '@/lib/api';
import { ProductCategorySchema } from '@/schema/product';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AlertTriangle, EditIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

export interface ProductCategory extends ProductCategorySchema {
  id: string;
  created_at: Date | any;
  updated_at: Date | any;
}

export default function Category() {
  const categories = useQuery({
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
  });

  const remove = useMutation({
    mutationKey: [`delete-category`],
    mutationFn: async (id: string) => {
      return await api
        .delete(`/product/category/${id}`)
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
      categories.refetch();
    },
  });

  return (
    <ContentLayout title="Category" tags={['product', 'category']}>
      <div className="grid rounded bg-background px-4 py-10 shadow-sm">
        <div className="flex justify-end">
          <CreateCategory />
        </div>
        {!categories.isLoading ? (
          <>
            {categories.data && (
              <div className="flex flex-wrap justify-center gap-4 py-10 md:justify-start">
                {categories.data.map((category: ProductCategory) => (
                  <Card className="min-w-[90%] px-0 pt-3 md:min-w-[250px]" key={category.id}>
                    <CardContent className="text-center text-sm font-semibold">
                      {category.name}
                    </CardContent>
                    <CardFooter className="flex justify-center space-x-4">
                      <UpdateCategory data={category} />
                      <Button
                        className="inline-flex gap-3 rounded"
                        size="sm"
                        variant={'destructive'}
                        onClick={async () => await remove.mutateAsync(category.id)}
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
