import { z } from 'zod';

export const salesSchema = z.object({
  date: z.date({ required_error: 'Date should not be empty' }),
  customer: z.string({
    required_error: 'Customer should not be empty',
  }),
  shipping: z.number({ required_error: 'Shipping should not be empty' }),
  status: z.string({ required_error: 'Sales Status should not be empty' }),
  note: z.string({ required_error: 'Sales Note should not be empty' }),
  remarks: z.string({ required_error: 'Staff Remark should not be empty' }),
  payment: z.string({ required_error: 'Payment Status should not be empty' }),
});

export type SalesSchema = z.infer<typeof salesSchema>;
