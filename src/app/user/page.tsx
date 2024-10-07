import { ContentLayout } from '@/components/content-layout';
import { DataTableSkeleton } from '@/components/data-table/skeleton';
import api from '@/lib/api';
import { IndexPageProps } from '@/types';
import React from 'react';
import { buildFilter, parseFilterInput, parseSort } from '@/lib/filter-parser';
import { UserSchema } from '@/schema/user';
import { UserTable } from '../_components/user/table';

export default async function UserList({ searchParams }: IndexPageProps) {
  const {
    page,
    per_page,

    sort,
  } = searchParams;

  const query = `page=${page ? Number(page) : 1}&page_size=${per_page ? Number(per_page) : 50}`;

  let data: any = {
    query: [{ $sort: parseSort(sort as string) }],
  };

  //   const response = useQuery({
  //     queryKey: ["get-Product"],
  //     queryFn: async (): Promise<any> => {
  const response = await api
    .get(`/user/?${query}`, {
      data: data,
    })
    .then((res) => {
      if (!res.data.success) {
        throw new Error(res.data.message);
      }
      return res.data;
    })
    .catch((err) => {
      console.log(err.response.data.data);
      throw err;
    });
  //   //     },
  //   //     refetchOnMount: true,
  //   //     enabled: false,
  //   //   });

  return (
    <ContentLayout title="Users" tags={['users']}>
      <React.Suspense
        fallback={
          <DataTableSkeleton
            columnCount={5}
            searchableColumnCount={1}
            filterableColumnCount={2}
            cellWidths={['10rem', '20rem', '12rem', '12rem', '8rem']}
            shrinkZero
          />
        }
      >
        {/**
         * Passing promises and consuming them using React.use for triggering the suspense fallback.
         * @see https://react.dev/reference/react/use
         */}

        <UserTable data={response.data.data} pageCount={1} />
      </React.Suspense>
    </ContentLayout>
  );
}
