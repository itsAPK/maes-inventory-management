import { ContentLayout } from '@/components/content-layout';
import { DataTableSkeleton } from '@/components/data-table/skeleton';
import api from '@/lib/api';
import { IndexPageProps } from '@/types';
import React from 'react';
import { buildFilter, parseFilterInput, parseSort } from '@/lib/filter-parser';
import { PurchaseDetailTable } from '../_components/purchase/detail-list/table';

export default async function SalesList({ searchParams }: IndexPageProps) {
  const {
    page,
    per_page,
    voucher_number,
    customer,
    product_name,
    product_code,
    billed_quantity,
    rate,
    total_amount,
    discount,
    from,
    to,
    sort,
    reference,
  } = searchParams;

  const query = `page=${page ? Number(page) : 1}&page_size=${per_page ? Number(per_page) : 50}`;

  const expressions: (any | undefined)[] = [
    voucher_number
      ? (() => {
          const parsed = parseFilterInput(voucher_number as string);
          console.log(parsed);
          return parsed
            ? buildFilter({
                column: 'voucher_number',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,
    rate
      ? (() => {
          const parsed = parseFilterInput(rate as string);
          return parsed
            ? buildFilter({
                column: 'product.rate',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,
    total_amount
      ? (() => {
          const parsed = parseFilterInput(total_amount as string);
          console.log(parsed);
          return parsed
            ? buildFilter({
                column: 'total_amount',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,
    voucher_number
      ? (() => {
          const parsed = parseFilterInput(voucher_number as string);
          console.log(parsed);
          return parsed
            ? buildFilter({
                column: 'voucher_number',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,

    !!customer
      ? (() => {
          const parsed = parseFilterInput(customer as string);
          return parsed
            ? buildFilter({
                column: 'customer.customer_name',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,

    !!product_name
      ? (() => {
          const parsed = parseFilterInput(product_name as string);
          return parsed
            ? buildFilter({
                column: 'product.name',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,

    !!product_code
      ? (() => {
          const parsed = parseFilterInput(product_code as string);
          return parsed
            ? buildFilter({
                column: 'product.product_code',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,
    !!billed_quantity
      ? (() => {
          const parsed = parseFilterInput(billed_quantity as string);
          return parsed
            ? buildFilter({
                column: 'billed_quantity',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,
    !!discount
      ? (() => {
          const parsed = parseFilterInput(discount as string);
          return parsed
            ? buildFilter({
                column: 'product.discount',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,
    !!reference
      ? (() => {
          const parsed = parseFilterInput(reference as string);
          return parsed
            ? buildFilter({
                column: 'reference',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,
  ].filter(Boolean);

  const filters = [...expressions];
  if (from && to) {
    filters.push({
      formatted_date: {
        $gte: new Date(from as string),
        $lte: new Date(to as string),
      },
    });
  }
  let data: any = {
    query: [
      {
        $addFields: {
          formatted_date: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$date',
            },
          },
        },
      },
      {
        $match: filters.reduce((acc, curr) => {
          return { ...acc, ...curr };
        }, {}),
      },
      { $sort: parseSort(sort as string) },
    ],
  };

  //   const response = useQuery({
  //     queryKey: ["get-sales"],
  //     queryFn: async (): Promise<any> => {
  const response = await api
    .post(`/purchase/query?${query}`, data)
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

  console.log(response.data.total_pages);

  return (
    <ContentLayout title="Purchase " tags={['purchase']}>
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

        <PurchaseDetailTable
          data={
            response.data
              ? response.data.data.map((i: any) => ({
                  ...i,
                  date: i.date.$date,
                  customer_name: i.customer.customer_name,
                  product_name: i.product.name,
                  product_code: i.product.product_code,
                  rate: i.product.rate,
                  discount: i.product.discount,
                }))
              : []
          }
          pageCount={response.data.total_pages}
        />
      </React.Suspense>
    </ContentLayout>
  );
}
