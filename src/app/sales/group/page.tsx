import { ContentLayout } from '@/components/content-layout';
import { DataTableSkeleton } from '@/components/data-table/skeleton';
import api from '@/lib/api';
import { IndexPageProps } from '@/types';
import React from 'react';
import { buildFilter, parseFilterInput, parseSort } from '@/lib/filter-parser';
import { SalesTable } from '../../_components/sales/list/table';

export default async function SalesList({ searchParams }: IndexPageProps) {
  const {
    page,
    per_page,
    voucher_number,
    party_name,
    item_name,
    item_part_no,
    billed_quantity,
    rate,
    discount,
    discount_amount,
    products,
    customer,
    from,
    to,
    sort,
    reference,
  } = searchParams;

  const query = `page=${page ? Number(page) : 1}&page_size=${per_page ? Number(per_page) : 20}`;

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

    !!reference
      ? (() => {
          const parsed = parseFilterInput(reference as string);
          console.log(parsed);
          return parsed
            ? buildFilter({
                column: 'reference',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,

    !!products
      ? (() => {
          const parsed = parseFilterInput(products as string);
          return parsed
            ? buildFilter({
                column: 'product.name',
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
    !!rate
      ? (() => {
          const parsed = parseFilterInput(rate as string);
          return parsed
            ? buildFilter({
                column: 'rate',
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
                column: 'discount',
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
    .post(`/sales/query/list?${query}`, data)
    .then((res) => {
      if (!res.data.success) {
        throw new Error(res.data.message);
      }
      return res.data;
    })
    .catch((err) => {
      console.log(err.response);
      throw err;
    });
  //     },
  //     refetchOnMount: true,
  //     enabled: false,
  //   });
  console.log(response.data);

  return (
    <ContentLayout title="Sales" tags={['sales']}>
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

        <SalesTable
          data={
            response.data.data
              ? response.data.data.map((i: any) => {
                  return {
                    ...i.sales[0],
                    date: i.sales[0].date.$date,
                    customer: i.sales[0].customer.customer_name,
                    billed_quantity: i.billed_quantity,
                    total_amount: i.sales[0].total_amount,
                    customers: {
                      ...i.sales[0].customer,
                      // _id: i.sales[0].customer._id.$oid,
                    },
                    alternate_actual_quantity: i.billed_quantity,
                    alternate_billed_quantity: i.billed_quantity,
                    products: i.sales.map((purchase: any) => ({
                      ...purchase.product,
                      quantity: purchase.billed_quantity,
                      _id: purchase.product._id,
                      category: purchase.product.category?.name,
                    })),
                  };
                })
              : []
          }
          pageCount={response.data.total_pages}
        />
      </React.Suspense>
    </ContentLayout>
  );
}
