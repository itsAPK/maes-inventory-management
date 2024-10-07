import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn, extractData, formatKey } from '@/lib/utils';
import { EyeIcon, PrinterIcon } from 'lucide-react';
import { PDFExport, savePDF } from '@progress/kendo-react-pdf';
import React from 'react';
import { DownloadIcon } from '@radix-ui/react-icons';
import { Purchase } from '@/app/_components/purchase/list/columns';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
interface ViewSalesProps {
  sales: Purchase;
}

export const ViewSales = ({ sales }: ViewSalesProps) => {
  const container = React.useRef<HTMLDivElement>(null);
  const pdfExportComponent = React.useRef<PDFExport>(null);
  const exportPDFWithMethod = () => {
    let element = container.current || document.body;
    savePDF(element, {
      paperSize: 'auto',
      margin: 40,
      fileName: `Sales-${sales.customer}-${sales.voucher_number}`,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex">
          <div className="mt-1">
            <EyeIcon className="h-3 w-3" />
          </div>
          <div className="px-2">View Sales</div>
        </div>
      </DialogTrigger>
      <DialogContent className="h-[90%] overflow-y-auto sm:min-w-[1200px]">
        <DialogHeader>
          <DialogTitle>
            {sales.customer} ({sales.voucher_number})
          </DialogTitle>
        </DialogHeader>
        <PDFExport
          ref={pdfExportComponent}
          paperSize="auto"
          margin={40}
          fileName={`Report for ${new Date().getFullYear()}`}
          author={'Madhav Auto'}
        >
          <div ref={container} className="grid gap-4 py-10 text-sm">
            <div className="gap- grid grid-cols-4 items-center border border-primary bg-primary p-4 text-sm font-semibold text-white">
              <div>Date : {new Date(sales.date as string).toLocaleDateString()}</div>
              <div>Voucher Number : {sales.voucher_number}</div>
              <div>GSTIN : {sales.gstin_uin}</div>
              <div>Location : {sales.products[0].godown}</div>
            </div>
            <div className="rounded bg-secondary p-3">
              <p className="py-1 font-bold text-primary">Supplier Details</p>
              <div className="text-[13px] font-medium">
                <div className="grid grid-cols-5 gap-3 pt-1">
                  {Object.entries(sales.customers)
                    .filter(([key]) => !['_id', 'created_at', 'updated_at'].includes(key))
                    .sort(([keyA], [keyB]) =>
                      keyA === 'customer_name' ? -1 : keyB === 'customer_name' ? 1 : 0,
                    )
                    .map(
                      ([key, value]) =>
                        value !== '' &&
                        value !== 0 && (
                          <div
                            key={key}
                            className={cn(
                              'flex flex-col space-y-1',
                              key === 'address' && 'col-span-2',
                            )}
                          >
                            <div className="text-xs font-semibold text-gray-500">
                              {formatKey(key).replace('Customer', '')}:
                            </div>
                            <div className="">{value !== '' ? value : 'N/A'}</div>
                          </div>
                        ),
                    )}
                </div>
              </div>
            </div>
            <div className="rounded bg-secondary p-3">
              <p className="py-1 font-bold text-primary">Product Details</p>
              <div className="text-[13px] font-medium">
                <div className="grid grid-cols-1 gap-3 pt-1">
                  <div className="rounded-lg border border-gray-200">
                    <div className="p-2">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product Code</TableHead>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Price</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sales.products.map((i) => (
                            <TableRow key={i._id}>
                              <TableCell className="font-medium">{i.name}</TableCell>
                              <TableCell>{i.product_code}</TableCell>
                              <TableCell>{i.category}</TableCell>
                              <TableCell>{i.quantity}</TableCell>
                              <TableCell>{i.rate}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>{' '}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded bg-secondary p-3">
              <p className="py-1 font-bold text-primary">Shipping and Handling Information</p>
              <div className="text-[13px] font-medium">
                <div className="grid grid-cols-5 gap-3 pt-1">
                  <div className="flex flex-col space-y-1">
                    <div className="text-xs font-semibold text-gray-500">
                      Place of Receipt by Shipper
                    </div>
                    <div className="">{sales.place_of_receipt_by_shipper ?? 'N/A'}</div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="text-xs font-semibold text-gray-500">Port of Loading </div>
                    <div className="">{sales.port_of_loading ?? 'N/A'} </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="text-xs font-semibold text-gray-500">Vessel/Flight No. </div>
                    <div className="">{sales.vessel_flight_no ?? 'N/A'}</div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="text-xs font-semibold text-gray-500">Port of Discharge </div>
                    <div className="">{sales.port_of_discharge ?? 'N/A'}</div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="text-xs font-semibold text-gray-500">Destination Country </div>
                    <div className="">{sales.destination_country ?? 'N/A'} </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="text-xs font-semibold text-gray-500">
                      Mode/Terms of Payment{' '}
                    </div>
                    <div className="">{sales.mode_terms_of_payment ?? 'N/A'} </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="text-xs font-semibold text-gray-500">Other References </div>
                    <div className="">{sales.other_references ?? 'N/A'} </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded bg-secondary p-3">
              <p className="py-1 font-bold text-primary">Compliance Information</p>
              <div className="text-[13px] font-medium">
                <div className="grid grid-cols-5 gap-3 pt-1">
                  <div className="flex flex-col space-y-1">
                    <div className="text-xs font-semibold text-gray-500">Buyers TIN No. </div>
                    <div className="">{sales.buyers_tin_no ?? 'N/A'} </div>
                  </div>{' '}
                  <div className="flex flex-col space-y-1">
                    <div className="text-xs font-semibold text-gray-500">CST Number </div>
                    <div className="">{sales.cst_number ?? 'N/A'} </div>
                  </div>{' '}
                  <div className="flex flex-col space-y-1">
                    <div className="text-xs font-semibold text-gray-500">GSTIN/UIN </div>
                    <div className="">{sales.other_references ?? 'N/A'} </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded bg-secondary p-3">
              <p className="py-1 font-bold text-primary">Order/Purchases Details</p>
              <div className="text-[13px] font-medium">
                <div className="grid grid-cols-5 gap-3 pt-1">
                  <div className="flex flex-col space-y-1">
                    <div className="text-xs font-semibold text-gray-500">Order Number</div>
                    <div className="">{sales.order_number ?? 'N/A'}</div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="text-xs font-semibold text-gray-500">Order Due Date</div>
                    <div className="">{sales.order_due_date ?? 'N/A'}</div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="text-xs font-semibold text-gray-500">Dispatch Document No</div>
                    <div className="">{sales.despatch_doc_no ?? 'N/A'}</div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="text-xs font-semibold text-gray-500">Despatch Through</div>
                    <div className="">{sales.despatch_through ?? 'N/A'}</div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="text-xs font-semibold text-gray-500">Destination</div>
                    <div className="">{sales.destination ?? 'N/A'}</div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="text-xs font-semibold text-gray-500">Tracking Number</div>
                    <div className="">{sales.tracking_number ?? 'N/A'}</div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="text-xs font-semibold text-gray-500">Order Tax</div>
                    <div className="">
                      {sales.products.reduce((i, j) => i + Number(j.rate_of_gst), 0) /
                        sales.products.length}{' '}
                      %
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="text-xs font-semibold text-gray-500">Total Amount</div>
                    <div className="">₹{sales.total_amount ?? 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded bg-secondary p-3">
              <p className="py-1 font-bold text-primary">Additional Information</p>
              <div className="text-[13px] font-medium">
                <div className="grid grid-cols-6 gap-3 pt-1">
                  <div className="flex flex-col space-y-1">
                    <div className="text-xs font-semibold text-gray-500">Payment Satus</div>
                    <div className="">{sales.payment_status ?? 'N/A'}</div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="text-xs font-semibold text-gray-500">Purchase Status</div>
                    <div className="">{sales.sales_status ?? 'N/A'}</div>
                  </div>

                  <div className="col-span-2 flex flex-col space-y-1">
                    <div className="text-xs font-semibold text-gray-500">Purchase Notes</div>
                    <div className="">{sales.sales_note ?? 'N/A'}</div>
                  </div>

                  <div className="col-span-2 flex flex-col space-y-1">
                    <div className="text-xs font-semibold text-gray-500">Staff Remarks</div>
                    <div className="">{sales.staff_remarks ?? 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PDFExport>
        <DialogFooter>
          <Button type="button" onClick={exportPDFWithMethod}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export as PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
