import { ContentLayout } from '@/components/content-layout';
import { DataTableSkeleton } from '@/components/data-table/skeleton';
import api from '@/lib/api';
import { IndexPageProps } from '@/types';
import React from 'react';
import { PurchasesTable } from '../_components/purchase/list/table';
import {
  buildFilter,
  buildSelectableFilter,
  parseFilterInput,
  parseSelectableFilterInput,
  parseSort,
} from '@/lib/filter-parser';
import { CustomersTable } from '../_components/customers/table';

export default async function CustomersList({ searchParams }: IndexPageProps) {
  const {
    page,
    per_page,
    customer_name,
    customer_alias,
    email,
    address,
    state,
    pincode,
    group,
    sort,
  } = searchParams;

  const expressions: (any | undefined)[] = [
    customer_name
      ? (() => {
          const parsed = parseFilterInput(customer_name as string);
          console.log(parsed);
          return parsed
            ? buildFilter({
                column: 'customer_name',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,
    customer_alias
      ? (() => {
          const parsed = parseFilterInput(customer_alias as string);
          return parsed
            ? buildFilter({
                column: 'customer_alias',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,
    email
      ? (() => {
          const parsed = parseFilterInput(email as string);
          console.log(parsed);
          return parsed
            ? buildFilter({
                column: 'email',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,
    address
      ? (() => {
          const parsed = parseFilterInput(address as string);
          console.log(parsed);
          return parsed
            ? buildFilter({
                column: 'address',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,

    !!state
      ? (() => {
          const parsed = parseFilterInput(state as string);
          return parsed
            ? buildFilter({
                column: 'state',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,

    !!pincode
      ? (() => {
          const parsed = parseFilterInput(pincode as string);
          return parsed
            ? buildFilter({
                column: 'pincode',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,

    !!group
      ? (() => {
          const parsed = parseFilterInput(group as string);
          return parsed
            ? buildFilter({
                column: 'group',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,
  ].filter(Boolean);

  const filters = [...expressions];

  let data: any = {
    query: [
      {
        $match: filters.reduce((acc, curr) => {
          return { ...acc, ...curr };
        }, {}),
      },
      { $sort: parseSort(sort as string) },
    ],
  };

  const query = `page=${page ? Number(page) : 1}&page_size=${per_page ? Number(per_page) : 50}`;

  //   const response = useQuery({
  //     queryKey: ["get-sales"],
  //     queryFn: async (): Promise<any> => {
  const response = await api
    .get(`/customer?${query}`, { data: data })
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
  //     },
  //     refetchOnMount: true,
  //     enabled: false,
  //   });

  return (
    <ContentLayout title="Customers" tags={['customers']}>
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

        <CustomersTable
          data={
            response.data.data
              ? response.data.data.map((data: any) => ({
                  ...data,
                  created_at: data.created_at.$date,
                  updated_at: data.updated_at.$date,
                  _id: data._id.$oid,
                }))
              : []
          }
          pageCount={response.data.total_pages}
        />
      </React.Suspense>
    </ContentLayout>
  );
}
