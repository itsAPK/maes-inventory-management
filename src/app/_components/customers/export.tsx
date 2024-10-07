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

export const ExportCustomer = () => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

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
  } = Object.fromEntries(params.entries());

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

  const response = useMutation({
    mutationKey: ['get-customer-export'],
    mutationFn: async (key: string): Promise<any> => {
      return await api
        .get(`/customer`, { data: data })
        .then((res) => {
          if (!res.data.success) {
            throw new Error(res.data.message);
          }
          const fetchedData = res.data.data.data;

          if (key === 'sheet') {
            if (fetchedData.length > 0) {
              exportToExcel(fetchedData, 'customer-report');
            } else {
              toast.error('No Data found', {
                icon: <AlertCircle />,
              });
            }
          } else {
            exportToPDF(
              [
                { header: 'Customer Name', dataKey: 'customer_name' },
                { header: 'Customer Alias', dataKey: 'customer_alias' },
                { header: 'Email', dataKey: 'email' },
                { header: 'Mobile No.', dataKey: 'mobile_number' },
                { header: 'Telephone No.', dataKey: 'telephone_number' },
                { header: 'Fax No.', dataKey: 'fax_no' },
                { header: 'Group', dataKey: 'group' },
                { header: 'Pin Code', dataKey: 'pincode' },
                { header: 'State', dataKey: 'state' },
                { header: 'Address', dataKey: 'address' },
              ],
              fetchedData,
              'customer-report',
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
