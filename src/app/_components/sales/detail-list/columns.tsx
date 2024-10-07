import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUpDown, Edit, EyeIcon, PrinterIcon } from 'lucide-react';
import React from 'react';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface SalesReport {
  _id: string;
  created_at: string; // Date string format: "YYYY-MM-DDTHH:mm:ss.ssssss"
  updated_at: string; // Date string format: "YYYY-MM-DDTHH:mm:ss.ssssss"
  voucher_number: string;
  reference: string;
  date: string; // Date string format: "YYYY-MM-DD"
  voucher_type: string;
  party_name: string;
  party_alias: number;
  party_address: string;
  party_pincode: number;
  party_contact_person: string;
  party_telephone_no: number;
  party_mobile_no: number;
  party_fax_no: string;
  party_email: string;
  party_group: string;
  party_state: string;
  party_notes: string;
  place_of_receipt_by_shipper: string;
  vessel_flight_no: string;
  port_of_loading: string;
  port_of_discharge: string;
  destination_country: string;
  mode_terms_of_payment: string;
  other_references: string;
  order_number: string;
  order_due_date: string;
  despatch_doc_no: string;
  despatch_through: string;
  destination: string;
  tracking_number: string;
  buyers_tin_no: string;
  cst_number: string;
  gstin_uin: string;
  item_name: string;
  item_alias: string;
  item_part_no: string;
  item_group: string;
  item_category: string;
  item_description: string;
  item_notes: string;
  item_tariff_class: string;
  mrp_marginal: string;
  item_hsn: number;
  item_rate_of_gst: number;
  godown: string;
  item_batch: string;
  actual_quantity: number;
  billed_quantity: number;
  alternate_actual_quantity: number;
  alternate_billed_quantity: number;
  rate: number;
  purchase_rate: number;
  unit: string;
  discount: number;
  discount_amount: number;
  margin: number;
  amount: number;
  standard_cost: number;
  standard_price: number;
  purchase_sales_ledger: string;
  narration: string;
}

export const salesReportColumns = (): ColumnDef<any>[] => {
  return [
    {
      accessorKey: 'date',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
      cell: ({ cell }) => new Date(cell.getValue() as any).toLocaleDateString(),
    },
    {
      accessorKey: 'reference',
      header: ({ column }) => <div className="text-center text-xs text-primary">Bill No.</div>,
      cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
      accessorKey: 'voucher_number',
      header: () => <div className="text-center text-xs text-primary">Voucher No.</div>,
    },
    {
      accessorKey: 'customer_name',
      header: ({ column }) => <div className="text-center text-xs text-primary">Customer</div>,
    },
    {
      accessorKey: 'product_name',
      header: ({ column }) => {
        return <div className="text-center text-xs text-primary">Product</div>;
      },
    },
    {
      accessorKey: 'product_code',
      header: ({ column }) => {
        return <div className="text-center text-xs text-primary">Product Code</div>;
      },
    },
    {
      accessorKey: 'billed_quantity',
      header: ({ column }) => {
        return <DataTableColumnHeader className="px-1" column={column} title="Quantity" />;
      },
    },
    {
      accessorKey: 'product.rate',
      header: ({ column }) => <div className="text-center text-xs text-primary">Product Price</div>,

      cell: ({ cell }) => `₹${cell.getValue()}`,
    },
    {
      accessorKey: 'discount',
      header: ({ column }) => <div className="text-center text-xs text-primary">Discount</div>,

      cell: ({ cell }) => `${cell.getValue()}%`,
    },
    {
      accessorKey: 'total_amount',
      header: ({ column }) => {
        return <DataTableColumnHeader className="ml-1 px-1" column={column} title="Sale Amount" />;
      },
      cell: ({ cell }) => `₹${Number(cell.getValue()).toFixed(2)}`,
    },
  ];
};
