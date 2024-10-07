import { z } from 'zod';

export const productCategorySchema = z.object({
  name: z.string({ required_error: 'Required' }),
});

export type ProductCategorySchema = z.infer<typeof productCategorySchema>;

export const productTypesSchema = z.object({
  name: z.string(),
  category_id: z.string(),
});

export type ProductTypeSchema = z.infer<typeof productTypesSchema>;

export const productSchema = z.object({
  name: z.string({ required_error: ' Name is required' }),
  alias: z.string().optional(),
  product_code: z.string({ required_error: 'Product code is required' }),
  group: z.string({ required_error: ' Group is required' }),
  category_id: z.string({ required_error: ' Category is required' }),
  brand_id: z.string({ required_error: ' Brand is required' }),
  product_type_id: z.string({ required_error: ' Product Type is required' }),
  description: z.string().optional(),
  notes: z.string().optional(),
  hsn_code: z.string({ required_error: 'HSN code is required' }),
  rate_of_gst: z.string({ required_error: 'Rate of GST is required' }),
  godown: z.string({ required_error: 'Godown is required' }),
  batch: z.string({ required_error: ' Batch is required' }).optional(),
  quantity: z.string({ required_error: 'Quantity is required' }),
  rate: z.string({ required_error: 'Rate is required' }),
  purchase_rate: z.string({ required_error: 'Purchase rate is required' }),
  unit: z.string({ required_error: 'Unit is required' }),
  discount: z.string().optional(),
  // total_amount: z.string({ required_error: 'Amount is required' }),
});

export type ProductSchema = z.infer<typeof productSchema>;
