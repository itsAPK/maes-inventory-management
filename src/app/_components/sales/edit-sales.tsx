'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Loader, TrashIcon } from 'lucide-react';
import { ContentLayout } from '@/components/content-layout';
import { SalesSchema, salesSchema } from '@/schema/sales';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { AutoComplete } from '@/components/ui/autocomplete';
import { CaretSortIcon, MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import api from '@/lib/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PurchaseSchema, purchaseSchema } from '@/schema/purchase';
import { ProductSchema } from '@/schema/product';
import router from 'next/router';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { Purchase } from '@/app/_components/purchase/list/columns';
import { Edit } from 'lucide-react';
interface EditPurchaseProps {
  data: Purchase;
}
export const EditSales = ({ data }: EditPurchaseProps) => {
  const [isLoading, setLoading] = useState(false);
  const [isDisabled, setDisbled] = useState(false);
  const [value, setValue] = useState<any[]>(
    data.products.map((o) => ({
      value: o._id,
      label: o.name,
    })),
  );
  const [product, setProduct] = useState<any[]>(data.products);
  const [productIn, setProductIn] = useState<any[]>(data.products.map((i) => i._id));
  const [search, setSearch] = useState<string>();
  const router = useRouter();
  const form = useForm<any>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      buyers_tin_no: data.buyers_tin_no ?? undefined,
      cst_number: data.cst_number ?? undefined,
      customer: data.customers._id ?? undefined,
      date: data.date ?? undefined,
      despatch_doc_no: data.despatch_doc_no ?? undefined,
      despatch_through: data.despatch_through ?? undefined,
      destination: data.destination ?? undefined,
      destination_country: data.destination_country ?? undefined,
      discount: data.discount ?? undefined,
      gstin_uin: data.gstin_uin ?? undefined,
      mode_terms_of_payment: data.mode_terms_of_payment ?? undefined,
      order_due_date: data.order_due_date ?? undefined,
      order_number: data.order_number ?? undefined,
      other_references: data.other_references ?? undefined,
      payment_status: data.payment_status ?? undefined,
      place_of_receipt_by_shipper: data.place_of_receipt_by_shipper ?? undefined,
      port_of_discharge: data.port_of_discharge ?? undefined,
      port_of_loading: data.port_of_loading ?? undefined,
      reference: data.reference ?? undefined,
      sales_note: data.sales_note ?? undefined,
      sales_status: data.sales_status ?? undefined,
      shipping_price: data.shipping_price ?? undefined,
      staff_remarks: data.staff_remarks ?? undefined,
      tracking_number: data.tracking_number ?? undefined,
      vessel_flight_no: data.vessel_flight_no ?? undefined,
      voucher_number: data.voucher_number ?? undefined,
      remaining_amount: data.remaining_amount ?? undefined,
    },
  });

  const [customerId, setCoustmerId] = useState(data.customers._id);
  const handleSelectedProduct = (e: any) => {
    const selectedProductNum = String(e.value);
    const selectedProduct = products.data.data.find((p: any) => p._id.$oid === selectedProductNum);

    if (selectedProduct) {
      setValue((prev) => [...prev, e]);

      setProduct((prev) => {
        const existingProduct = prev.find((p) => p._id === selectedProductNum);

        if (existingProduct) {
          return prev.map((p) =>
            p._id === selectedProductNum
              ? {
                  ...p,

                  quantity: p.quantity + 1,
                  total_amount: (
                    Number(p.rate) * Number(p.quantity + 1) -
                    Number(p.rate) *
                      Number(p.quantity + 1) *
                      Number(p.discount ? Number(p.discount) : 0 / 100)
                  ).toFixed(2),
                }
              : p,
          );
        } else {
          return [
            ...prev,
            {
              ...selectedProduct,
              _id: selectedProduct._id.$oid,
              quantity: 1,
              total_amount: (
                Number(selectedProduct.rate) * Number(1) -
                Number(selectedProduct.rate) *
                  Number(1) *
                  Number(selectedProduct.discount ? Number(selectedProduct.discount) : 0 / 100)
              ).toFixed(2),
            },
          ];
        }
      });
    }
  };

  let d: any = {
    query: [],
  };

  const products = useQuery({
    queryKey: ['get-product'],
    queryFn: async (): Promise<any> => {
      return await api
        .post(`/product/query?page=1&page_size=10`, data)
        .then((res) => {
          if (!res.data.success) {
            throw new Error(res.data.message);
          }
          return res.data.data;
        })
        .catch((err) => {
          console.log(err.response.data.data);
          throw err;
        });
    },
    refetchOnMount: true,
    enabled: true,
  });

  const customer = useQuery({
    queryKey: ['get-customer'],
    queryFn: async (): Promise<any> => {
      return await api
        .get(`/customer?page=1&page_size=100`)
        .then((res) => {
          if (!res.data.success) {
            throw new Error(res.data.message);
          }
          return res.data.data;
        })
        .catch((err) => {
          console.log(err.response.data.data);
          throw err;
        });
    },
    refetchOnMount: true,
    enabled: true,
  });

  const handleProductSearch = (value: string) => {
    setSearch(value);
    d.query.push({
      $match: { name: { $regex: value, $options: 'i' } },
    });
    products.refetch();
  };
  const searchParams = useSearchParams();

  const create = useMutation({
    mutationKey: ['update-purchase'],
    mutationFn: async (data: PurchaseSchema) => {
      const postPayload = product
        .filter((k) => !productIn.includes(k._id))
        .map((i: any) => ({
          ...data,
          product_id: [i._id],
          total_amount: i.total_amount,
          discount: i.discount,
          actual_quantity: i.quantity,
          billed_quantity: i.quantity,
          alternate_actual_quantity: i.quantity,
          alternate_billed_quantity: i.quantity,
          grand_total: i.total_amount,
          remaining_amount: i.remaining_amount,
        }));

      const patchPayload = product
        .filter((k) => productIn.includes(k._id))
        .map((i: any) => ({
          ...data,
          product_id: [i._id],
          total_amount: i.total_amount,
          discount: i.discount,
          order_tax: i.rate_of_gst,
          actual_quantity: i.quantity,
          billed_quantity: i.quantity,
          alternate_actual_quantity: i.quantity,
          alternate_billed_quantity: i.quantity,
          grand_total: i.total_amount,
          remaining_amount: i.remaining_amount,
        }));

      const response = [];
      for (const p of postPayload) {
        const r = await api
          .post(`/sales/`, p)
          .then((res) => {
            if (!res.data.success) {
              throw new Error(res.data.message);
            }
            return res.data;
          })
          .catch((err) => {
            throw err;
          });

        response.push(r.data);
      }

      for (const p of patchPayload) {
        const r = await api
          .patch(`/sales?product_id=${p.product_id[0]}&reference_id=${p.reference}`, p)
          .then((res) => {
            if (!res.data.success) {
              throw new Error(res.data.message);
            }
            return res.data;
          })
          .catch((err) => {
            throw err;
          });

        response.push(r.data);
      }

      return response;
    },
    onError: (error) => {
      toast.error(error.message, {
        icon: <AlertTriangle className="h-4 w-4" />,
      });
    },
    onSuccess: (data, variables, context) => {
      form.reset();
      toast.success('Sales Updated', {
        icon: <AlertTriangle className="h-4 w-4" />,
      });
      router.push(`/sales/group?${searchParams.toString()}`);
      router.refresh();
    },
  });

  const onSubmit = form.handleSubmit(async (data: PurchaseSchema) => {
    await create.mutateAsync(data);
  });

  console.log(data.products);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex">
          <div className="mt-1">
            <Edit className="h-3 w-3" />
          </div>
          <div className="px-2">Edit Sales</div>
        </div>
      </DialogTrigger>
      <DialogContent className="h-[90%] overflow-y-auto sm:min-w-[1200px]">
        <DialogHeader>
          <DialogTitle>Edit Sales</DialogTitle>
        </DialogHeader>{' '}
        <Form {...form}>
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="col-span-3 px-2 py-4">
              <div className="grid gap-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <DatePicker
                            {...field}
                            placeholder=""
                            defaultValue={new Date().toISOString()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(e) => {
                              field.onChange(e);

                              setCoustmerId(e);
                            }}
                            defaultValue={customerId}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {customer.data &&
                                customer.data.data.map((i: any) => (
                                  <SelectItem key={i._id.$oid} value={i._id.$oid}>
                                    {i.customer_name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="voucher_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vochure Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bill No.</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1">
                  <div className="flex flex-col space-y-3">
                    <FormLabel>Select Product</FormLabel>
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <button
                            type="button"
                            role="combobox"
                            className={cn(
                              'flex h-11 w-full items-center justify-between border border-input bg-[#f9f9f9] px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-foreground',
                            )}
                          >
                            {value.length > 0
                              ? `${value[value.length - 1].label} (${value.length} items Added)`
                              : 'Select Product'}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full">
                        <AutoComplete
                          options={
                            products.data
                              ? products.data.data.map((i: any) => ({
                                  value: String(i._id.$oid),
                                  label: i.name,
                                }))
                              : []
                          }
                          onSearch={handleProductSearch}
                          emptyMessage="No Product Found."
                          isLoading={products.isLoading}
                          onValueChange={handleSelectedProduct}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="my-6 border pb-4">
                    <Table>
                      {value.length === 0 && <TableCaption>No Data Found.</TableCaption>}
                      <TableHeader className="h-12 bg-slate-100 dark:bg-slate-800">
                        <TableRow>
                          <TableHead className="w-[100px]">Product Id</TableHead>
                          <TableHead>Product Name</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead className="">Quantity</TableHead>
                          <TableHead className="">Discount</TableHead>
                          <TableHead className="">Tax (%)</TableHead>
                          <TableHead>SubTotal</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      {value.length > 0 && (
                        <TableBody>
                          {product.map((v) => {
                            return (
                              <TableRow key={v._id} className="">
                                <>
                                  <TableCell className="my-2 text-xs font-medium">
                                    {v.product_code}
                                  </TableCell>
                                  <TableCell className="my-2 text-xs">{v.name}</TableCell>
                                  <TableCell className="my-2 text-xs">₹ {v.rate}</TableCell>
                                  <TableCell className="my-2 text-xs">
                                    <div className="flex space-x-2">
                                      <Button
                                        type="button"
                                        size="icon"
                                        className="h-5 w-5 rounded-[1px]"
                                        onClick={() =>
                                          setProduct((prev) =>
                                            prev.map((p) =>
                                              p._id === v._id
                                                ? {
                                                    ...p,
                                                    quantity: p.quantity + 1,
                                                    total_amount: (
                                                      Number(p.rate) * Number(p.quantity + 1) -
                                                      Number(p.rate) *
                                                        Number(p.quantity + 1) *
                                                        Number(
                                                          p.discount ? Number(p.discount) : 0 / 100,
                                                        )
                                                    ).toFixed(2),
                                                  }
                                                : p,
                                            ),
                                          )
                                        }
                                      >
                                        <PlusIcon />
                                      </Button>{' '}
                                      <div className="text-xs">{v.quantity}</div>
                                      <Button
                                        type="button"
                                        variant={'destructive'}
                                        size="icon"
                                        className="h-5 w-5 rounded-[1px]"
                                        onClick={() =>
                                          setProduct((prev) =>
                                            prev.map((p) =>
                                              p._id === v._id
                                                ? {
                                                    ...p,
                                                    quantity:
                                                      p.quantity - 1 >= 0
                                                        ? p.quantity - 1
                                                        : p.quantity,
                                                    total_amount: (
                                                      Number(p.rate) *
                                                        Number(
                                                          p.quantity - 1 >= 0
                                                            ? p.quantity - 1
                                                            : p.quantity,
                                                        ) -
                                                      Number(p.rate) *
                                                        Number(
                                                          p.quantity - 1 >= 0
                                                            ? p.quantity - 1
                                                            : p.quantity,
                                                        ) *
                                                        Number(
                                                          p.discount ? Number(p.discount) : 0 / 100,
                                                        )
                                                    ).toFixed(2),
                                                  }
                                                : p,
                                            ),
                                          )
                                        }
                                      >
                                        <MinusIcon />
                                      </Button>
                                    </div>
                                  </TableCell>
                                  <TableCell className="py-2 text-xs">{v.discount}%</TableCell>
                                  <TableCell className="py-2 text-xs">{v.rate_of_gst}%</TableCell>
                                  <TableCell className="py-2 text-xs">₹ {v.total_amount}</TableCell>
                                  <TableCell className="py-2">
                                    <Button
                                      type="button"
                                      variant={'destructive'}
                                      size="icon"
                                      className="h-6 w-6 rounded-[1px]"
                                      onClick={() => {
                                        setProduct((prev) => prev.filter((p) => p._id !== v._id));
                                        setValue((prev) => prev.filter((i) => i.value !== v._id));
                                      }}
                                    >
                                      <TrashIcon className="h-3 w-3" />
                                    </Button>
                                  </TableCell>
                                </>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      )}
                    </Table>
                    <div className="flex justify-end px-4 py-10 text-[15px]">
                      <div className="grid">
                        <div className="flex justify-between space-x-[80px] border-b bg-slate-50 p-3 dark:bg-slate-900">
                          <div className="">Total Amount</div>
                          <div className="">:</div>
                          <div className="">
                            ₹{' '}
                            {Number(
                              product.reduce((i, j) => i + Number(j.total_amount), 0),
                            ).toFixed(2)}
                          </div>
                        </div>
                        <div className="flex justify-between space-x-[80px] border-b bg-stone-100 p-3 dark:bg-stone-900">
                          <div className="">Tax</div>
                          <div className="">:</div>
                          <div className="">
                            {product.length > 0
                              ? Number(product.reduce((i, j) => i + Number(j.rate_of_gst), 0)) /
                                product.length
                              : 0}{' '}
                            %
                          </div>
                        </div>
                        <div className="flex justify-between space-x-[80px] border-b bg-slate-50 p-3 dark:bg-slate-900">
                          <div className="">Discount</div>
                          <div className="">:</div>
                          <div className="">
                            {' '}
                            {product.length > 0
                              ? Number(product.reduce((i, j) => i + Number(j.discount), 0)) /
                                product.length
                              : 0}{' '}
                            %
                          </div>
                        </div>
                        <div className="flex justify-between space-x-[80px] border-b p-3 font-semibold">
                          <div className="">Grand Total</div>
                          <div className="">:</div>
                          <div className="">
                            ₹{' '}
                            {Number(
                              product.reduce((i, j) => i + Number(j.total_amount), 0),
                            ).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded border p-3">
                  <div className="font-medium text-muted-foreground">
                    Shipping and Handling Information
                  </div>
                  <div className="grid gap-6 pt-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="place_of_receipt_by_shipper"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Place of Receipt by Shipper <span className="text-xs">(Optional)</span>
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
                      name="vessel_flight_no"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Vessel/Flight No. <span className="text-xs">(Optional)</span>
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
                      name="port_of_loading"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Port of Loading <span className="text-xs">(Optional)</span>
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
                      name="port_of_discharge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Port of Discharge <span className="text-xs">(Optional)</span>
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
                      name="destination_country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Destination Country <span className="text-xs">(Optional)</span>
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
                      name="mode_terms_of_payment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Mode/Terms of Payment <span className="text-xs">(Optional)</span>
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
                      name="other_references"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Other References <span className="text-xs">(Optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="rounded border p-3">
                  <div className="font-medium text-muted-foreground">Order Details</div>
                  <div className="grid gap-6 pt-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="order_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Order Number <span className="text-xs">(Optional)</span>
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
                      name="order_due_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Order Due Date <span className="text-xs">(Optional)</span>
                          </FormLabel>
                          <FormControl>
                            <DatePicker {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="despatch_doc_no"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Dispatch Document No. <span className="text-xs">(Optional)</span>
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
                      name="despatch_through"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Despatch Through <span className="text-xs">(Optional)</span>
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
                      name="destination"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Destination <span className="text-xs">(Optional)</span>
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
                      name="tracking_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Tracking Number <span className="text-xs">(Optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="rounded border p-3">
                  <div className="font-medium text-muted-foreground">Compliance Information</div>
                  <div className="grid gap-6 pt-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="buyers_tin_no"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Buyers TIN No. <span className="text-xs">(Optional)</span>
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
                      name="cst_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            CST Number <span className="text-xs">(Optional)</span>
                          </FormLabel>
                          <FormControl>
                            <DatePicker {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gstin_uin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GSTIN/UIN</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="rounded border p-3">
                  <div className="font-medium text-muted-foreground">Additional Information</div>

                  <div className="grid gap-6 pt-4 md:grid-cols-4">
                    <FormField
                      control={form.control}
                      name="sales_status"
                      render={({ field }) => (
                        <FormItem>
                          <div className="mt-2 flex flex-col space-y-3">
                            <FormLabel>Purchases Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {['Completed', 'Incompleted', 'Drafts'].map((i) => (
                                  <SelectItem key={i} value={i}>
                                    {i}
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
                      name="payment_status"
                      render={({ field }) => (
                        <FormItem>
                          <div className="mt-2 flex flex-col space-y-3">
                            <FormLabel>Payment Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {['Partial', 'Paid', 'Unpaid'].map((i) => (
                                  <SelectItem key={i} value={i}>
                                    {i}
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
                      name="shipping_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Shipping Price <span className="text-xs">(Optional)</span>
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
                      name="remaining_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Remaining Amount <span className="text-xs">(Optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-6 pt-5 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="sales_note"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Purchases Note <span className="text-xs">(Optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="staff_remarks"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Staff Remarks <span className="text-xs">(Optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
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
