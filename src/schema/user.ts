import { z } from 'zod';

export const userSchema = z.object({
  full_name: z
    .string({ required_error: 'Name should not be empty' })
    .min(3, 'Name must contain at least 3 character(s)'),
  employee_id: z.string({
    required_error: 'Employee ID should not be empty',
  }),
  mobile: z.string({ required_error: 'Mobile Number should not be empty' }),
  email: z.string({ required_error: 'E-mail should not be empty' }).email('Invalid Email'),
  gender: z.string({ required_error: 'Gender should not be empty' }),
  password: z.string({ required_error: 'Password should not be empty' }),
  role: z.string({ required_error: 'Role should not be empty' }),
  branch: z.string().optional(),
});

export type UserSchema = z.infer<typeof userSchema>;

export const customerSchema = z.object({
  customer_name: z.string({ required_error: 'Customer name is required' }),
  customer_alias: z.string().optional(),
  address: z.string({ required_error: 'Customer address is required' }),
  pincode: z.string().min(0, 'Pincode cannot be negative').optional(),
  customer_contact_person: z.string().optional(),
  telephone_number: z.string().optional(),
  mobile_number: z.string({ required_error: 'Customer mobile number is required' }),
  fax_no: z.string().optional(),
  email: z.string({ required_error: 'Customer email is required' }).email('Invalid email format'),
  group: z.string().optional(),
  state: z.string().optional(),
});

export type CustomerSchema = z.infer<typeof customerSchema>;

export const monthlyTragetSchema = z.object({
  target: z.string({ required_error: 'Target is required' }),
});

export type MonthlyTargetSchema = z.infer<typeof monthlyTragetSchema>;
