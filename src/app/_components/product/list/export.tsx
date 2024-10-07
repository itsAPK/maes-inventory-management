'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AlertCircle, DownloadIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { ExportAsExcel, ExportAsPdf } from 'react-export-table';
import { IndexPageProps } from '@/types';
import { parseFilterInput, buildFilter, parseSort } from '@/lib/filter-parser';
import api from '@/lib/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { exportToExcel, exportToPDF } from '@/lib/utils';
import { toast } from 'sonner';

export const ExportProduct = () => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

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
  } = Object.fromEntries(params.entries());

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
                column: 'product_type',
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
                column: 'category',
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
                column: 'brand',
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

  const response = useMutation({
    mutationKey: ['get-product-export'],
    mutationFn: async (key: string): Promise<any> => {
      return await api
        .post(`/product/query`, data)
        .then((res) => {
          if (!res.data.success) {
            throw new Error(res.data.message);
          }
          const fetchedData = res.data.data.data;

          if (key === 'sheet') {
            if (fetchedData.length > 0) {
              exportToExcel(fetchedData, 'product-report');
            } else {
              toast.error('No Data found', {
                icon: <AlertCircle />,
              });
            }
          } else {
            exportToPDF(
              [
                { header: 'Name', dataKey: 'name' },
                { header: 'Product Code', dataKey: 'product_code' },
                { header: 'HSN Code', dataKey: 'hsn_code' },
                { header: 'GST', dataKey: 'rate_of_gst' },
                { header: 'Quantity', dataKey: 'quantity' },
                { header: 'Discount', dataKey: 'discount' },
                { header: 'Purchase Rate', dataKey: 'purchase_rate' },
                { header: 'Rate', dataKey: 'rate' },
              ],
              fetchedData,
              'product-report',
            );
          }
          return fetchedData;
        })
        .catch((err) => {
          console.log(err.response.data.data);
          throw err;
        });
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" size="sm">
            <DownloadIcon className="mr-2 size-4 shrink-0" aria-hidden="true" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              response.mutateAsync('sheet');
            }}
          >
            <div>Export as Excel</div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              response.mutateAsync('pdf');
            }}
          >
            <div>Export as PDF</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
