import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  FormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { customerSchema, CustomerSchema, userSchema, UserSchema } from '@/schema/user';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AlertTriangle, EditIcon, Loader } from 'lucide-react';
import { ContentLayout } from '@/components/content-layout';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Customer } from './table';
import { State } from 'country-state-city';
interface EditCustomerProps {
  data: Customer;
}

export const EditCustomer = ({ data }: EditCustomerProps) => {
  const form = useForm<CustomerSchema>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      address: data.address,
      customer_alias: data.customer_alias ?? undefined,
      customer_contact_person: data.customer_contact_person ?? undefined,
      customer_name: data.customer_name,
      email: data.email,
      fax_no: data.fax_no ?? undefined,
      group: data.group ?? undefined,
      mobile_number: data.mobile_number,
      pincode: data.pincode,
      state: data.state,
      telephone_number: data.telephone_number ?? undefined,
    },
  });
  const [logo, setLogo] = useState<File[] | null>(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const update = useMutation({
    mutationKey: ['update-customer'],
    mutationFn: async (d: CustomerSchema) => {
      return await api
        .patch(`/customer/${data._id}`, d)
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
      toast.success('Customer Updated', {
        icon: <AlertTriangle className="h-4 w-4" />,
      });
      setOpen(false);
      const params = new URLSearchParams(searchParams.toString());
      router.push(`${pathname}?${params.toString()}`);
      router.refresh();
    },
  });

  const onSubmit = form.handleSubmit(async (data: CustomerSchema) => {
    await update.mutateAsync(data);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex">
          <div className="mt-1">
            <EditIcon className="h-3 w-3" />
          </div>
          <div className="px-2">Edit</div>
        </div>
      </DialogTrigger>
      <DialogContent className="h-[90%] overflow-y-auto sm:min-w-[1200px]">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
};
