'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  FormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { CustomerSchema, customerSchema, UserSchema } from '@/schema/user';
import { useMutation } from '@tanstack/react-query';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Loader } from 'lucide-react';
import { ContentLayout } from '@/components/content-layout';
import { State } from 'country-state-city';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AddCustomer() {
  const form = useForm<CustomerSchema>({
    resolver: zodResolver(customerSchema),
  });
  const router = useRouter();

  const create = useMutation({
    mutationKey: ['create-customer'],
    mutationFn: async (data: CustomerSchema) => {
      return await api
        .post(`/customer`, data)
        .then((res) => {
          if (!res.data.success) {
            throw new Error(res.data.message);
          }
          return res.data;
        })
        .catch((err) => {
          throw err;
        });
    },
    onError: (error) => {
      toast.error(error.message, {
        icon: <AlertTriangle className="h-4 w-4" />,
      });
    },
    onSuccess: (data, variables, context) => {
      toast.success('Customer Created', {
        icon: <AlertTriangle className="h-4 w-4" />,
      });
      router.push('/customers');
      router.refresh();
    },
  });

  const onSubmit = form.handleSubmit(async (data: CustomerSchema) => {
    await create.mutateAsync(data);
  });
  return (
    <ContentLayout title={'Add Customer'} tags={['customers', 'new']}>
      <div className="shadow-form container relative mb-7 min-h-[120px] bg-white pt-10 shadow dark:bg-background">
        <Form {...form}>
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="flex grid-cols-1 flex-col gap-6 md:grid md:grid-cols-2">
              <FormField
                control={form.control}
                name="customer_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customer_alias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Customer Alias <span className="text-xs">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobile_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telephone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Telephone Number <span className="text-xs">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      {/* @ts-ignore  */}

                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customer_contact_person"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Customer Contact Person <span className="text-xs">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fax_no"
                render={({ field }) => (
                  <FormItem>
                    <div className="mt-2 flex flex-col space-y-3">
                      <FormLabel>
                        Fax No. <span className="text-xs">(Optional)</span>
                      </FormLabel>
                      <Input {...field} />
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="group"
                render={({ field }) => (
                  <FormItem>
                    <div className="mt-2 flex flex-col space-y-3">
                      <FormLabel>
                        Group <span className="text-xs">(Optional)</span>
                      </FormLabel>
                      {/* @ts-ignore  */}

                      <Input {...field} />
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <div className="mt-2 flex flex-col space-y-3">
                      <FormLabel>Pincode</FormLabel>
                      {/* @ts-ignore  */}

                      <Input {...field} type="number" />
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <div className="mt-2 flex flex-col space-y-3">
                      <FormLabel>State</FormLabel>
                      {/* @ts-ignore  */}
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {State.getStatesOfCountry('IN').map((i) => (
                            <SelectItem key={i.name} value={i.name}>
                              {i.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <div className="mt-2 flex flex-col space-y-3">
                      <FormLabel>Address</FormLabel>
                      <Input {...field} />
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-center px-3 pb-10 lg:justify-end">
              <Button
                type="submit"
                variant={'default'}
                className="flex h-12 w-[250px] gap-2"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && <Loader className="h-4 w-4 animate-spin" />}
                <span>Submit</span>
              </Button>
            </div>
          </form>
        </Form>{' '}
      </div>
    </ContentLayout>
  );
}
