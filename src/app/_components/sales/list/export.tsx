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

export const ExportSales = () => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const {
    page,
    per_page,
    voucher_number,
    party_name,
    item_name,
    item_part_no,
    billed_quantity,
    rate,
    purchase_rate,
    discount,
    margin,
    discount_amount,
    amount,
    from,
    to,
    sort,
  } = Object.fromEntries(params.entries());

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
    purchase_rate
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

    !!party_name
      ? (() => {
          const parsed = parseFilterInput(party_name as string);
          return parsed
            ? buildFilter({
                column: 'party_name',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,

    !!item_name
      ? (() => {
          const parsed = parseFilterInput(item_name as string);
          return parsed
            ? buildFilter({
                column: 'item_name',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,

    !!item_part_no
      ? (() => {
          const parsed = parseFilterInput(item_part_no as string);
          return parsed
            ? buildFilter({
                column: 'item_part_no',
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
    discount_amount
      ? (() => {
          const parsed = parseFilterInput(discount_amount as string);
          return parsed
            ? buildFilter({
                column: 'discount_amount',
                operator: parsed.operator,
                value: parsed.value,
              })
            : undefined;
        })()
      : undefined,
    !!margin
      ? (() => {
          const parsed = parseFilterInput(margin as string);
          return parsed
            ? buildFilter({
                column: 'margin',
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

  if (from && to) {
    data.filter_date = {
      start_date: new Date(from as string).toISOString(),
      end_date: new Date(to as string).toISOString(),
    };
  }

  const response = useMutation({
    mutationKey: ['get-sales-export'],
    mutationFn: async (key: string): Promise<any> => {
      return await api
        .post(`/transaction/sell/query`, data)
        .then((res) => {
          if (!res.data.success) {
            throw new Error(res.data.message);
          }
          const fetchedData = res.data.data.data;

          if (key === 'sheet') {
            if (fetchedData.length > 0) {
              exportToExcel(fetchedData, 'sales-report');
            } else {
              toast.error('No Data found', {
                icon: <AlertCircle />,
              });
            }
          } else {
            exportToPDF(
              [
                { header: 'Voucher Number', dataKey: 'voucher_number' },
                { header: 'Date', dataKey: 'date' },
                { header: 'Party Name', dataKey: 'party_name' },
                { header: 'Product', dataKey: 'item_name' },
                { header: 'Product Code', dataKey: 'item_part_no' },
                { header: 'Billed Quantity', dataKey: 'billed_quantity' },
                { header: 'Rate', dataKey: 'rate' },
                { header: 'Purchase Rate', dataKey: 'purchase_rate' },
                { header: 'Amount', dataKey: 'amount' },
              ],
              fetchedData,
              'sales-report',
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
