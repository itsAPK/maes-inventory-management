import { ContentLayout } from '@/components/content-layout';
import { DataTableSkeleton } from '@/components/data-table/skeleton';
import api from '@/lib/api';
import { IndexPageProps } from '@/types';
import React from 'react';
import { buildFilter, parseFilterInput, parseSort } from '@/lib/filter-parser';
import { ProductTable } from '../_components/product/list/table';
import { Product } from '../_components/product/list/columns';

export default async function ProductList({ searchParams }: IndexPageProps) {
  const {
    page,
    per_page,
    name,
    alias,
    product_code,
    group,
    category,
    brand,
    discount,
    product_type,
    amount,
    hsn_code,
    godown,
    batch,
    quantity,
    purchase_rate,
    total_amount,
    rate_of_gst,
    rate,
    sort,
  } = searchParams;

  const query = `page=${page ? Number(page) : 1}&page_size=${per_page ? Number(per_page) : 50}`;

  const expressions: (any | undefined)[] = [
    name
      ? (() => {
          const parsed = parseFilterInput(name as string);
          console.log(parsed);
          return parsed
            ? buildFilter({
                column: 'name',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,
    product_type
      ? (() => {
          const parsed = parseFilterInput(product_type as string);
          return parsed
            ? buildFilter({
                column: 'product_type.name',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,
    amount
      ? (() => {
          const parsed = parseFilterInput(amount as string);
          console.log(parsed);
          return parsed
            ? buildFilter({
                column: 'amount',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,
    rate_of_gst
      ? (() => {
          const parsed = parseFilterInput(rate_of_gst as string);
          console.log(parsed);
          return parsed
            ? buildFilter({
                column: 'rate_of_gst',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,
    name
      ? (() => {
          const parsed = parseFilterInput(name as string);
          console.log(parsed);
          return parsed
            ? buildFilter({
                column: 'name',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,

    !!alias
      ? (() => {
          const parsed = parseFilterInput(alias as string);
          return parsed
            ? buildFilter({
                column: 'alias',
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
                column: 'product_code',
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
    !!category
      ? (() => {
          const parsed = parseFilterInput(category as string);
          return parsed
            ? buildFilter({
                column: 'category.name',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,
    !!brand
      ? (() => {
          const parsed = parseFilterInput(brand as string);
          return parsed
            ? buildFilter({
                column: 'brand.name',
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
    !!hsn_code
      ? (() => {
          const parsed = parseFilterInput(hsn_code as string);
          return parsed
            ? buildFilter({
                column: 'hsn_code',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,
    !!godown
      ? (() => {
          const parsed = parseFilterInput(godown as string);
          return parsed
            ? buildFilter({
                column: 'godown',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,
    !!quantity
      ? (() => {
          const parsed = parseFilterInput(quantity as string);
          return parsed
            ? buildFilter({
                column: 'quantity',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,
    !!batch
      ? (() => {
          const parsed = parseFilterInput(batch as string);
          return parsed
            ? buildFilter({
                column: 'batch',
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
    !!purchase_rate
      ? (() => {
          const parsed = parseFilterInput(purchase_rate as string);
          return parsed
            ? buildFilter({
                column: 'purchase_rate',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,
    !!total_amount
      ? (() => {
          const parsed = parseFilterInput(total_amount as string);
          return parsed
            ? buildFilter({
                column: 'total_amount',
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

  //   const response = useQuery({
  //     queryKey: ["get-Product"],
  //     queryFn: async (): Promise<any> => {
  const response = await api
    .post(`/product/query?${query}`, data)
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

  console.log(response.data.data.map((i: any) => console.log(i.product_type)));

  return (
    <ContentLayout title="Products" tags={['products']}>
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

        <ProductTable
          data={response.data.data.map((i: any) => ({
            ...i,
            brand: i.brand ? i.brand?.name : 'N/A',
            brand_id: i.brand ? i.brand._id.$oid : '',
            category: i.category ? i.category?.name : 'N/A',
            category_id: i.category ? i.category._id?.$oid : '',
            product_type: i.product_type ? i.product_type?.name : 'N/A',
            product_type_id: i.product_type ? i.product_type?._id?.$oid : '',
            _id: i._id.$oid,
            created_at: i.created_at.$date,
            updated_at: i.updated_at.$date,
          }))}
          pageCount={response.data.total_pages}
        />
      </React.Suspense>
    </ContentLayout>
  );
}
