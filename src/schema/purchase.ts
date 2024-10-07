import { z } from 'zod';

export const purchaseSchema = z.object({
  customer: z.string({
    required_error: 'Customer should not be empty',
  }),
  voucher_number: z.string({ required_error: 'Voucher Number should not be empty' }),
  reference: z.string({ required_error: 'Bill No. should not be empty' }),
  order_tax: z.string().optional(),
  discount: z.string().optional(),
  shipping_price: z.string().optional(),
  sales_status: z.string({ required_error: "Status should not be empty' " }),
  payment_status: z.string({ required_error: "Status should not be empty' " }),
  sales_note: z.string().optional(),
  staff_remarks: z.string().optional(),
  place_of_receipt_by_shipper: z.string().optional(),
  vessel_flight_no: z.string().optional(),
  port_of_loading: z.string().optional(),
  port_of_discharge: z.string().optional(),
  destination_country: z.string().optional(),
  mode_terms_of_payment: z.string().optional(),
  other_references: z.string().optional(),
  order_number: z.string().optional(),
  order_due_date: z.string().optional(),
  despatch_doc_no: z.string().optional(),
  despatch_through: z.string().optional(),
  destination: z.string().optional(),
  tracking_number: z.string().optional(),
  buyers_tin_no: z.string().optional(),
  cst_number: z.string().optional(),
  gstin_uin: z.string().optional(),
  date: z.string().optional(),
  remaining_amount: z.string().optional(),
});

export type PurchaseSchema = z.infer<typeof purchaseSchema>;
