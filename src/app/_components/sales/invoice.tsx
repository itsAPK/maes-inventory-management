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

interface InvoiceProps {
  sales: Purchase;
}

export const SalesInvoice = ({ sales }: InvoiceProps) => {
  const container = React.useRef<HTMLDivElement>(null);
  const pdfExportComponent = React.useRef<PDFExport>(null);
  const exportPDFWithMethod = () => {
    let element = container.current || document.body;
    savePDF(element, {
      paperSize: 'auto',
      margin: 40,
      fileName: `Invoice-${sales.customer}-${sales.voucher_number}`,
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex">
          <div className="mt-1">
            <PrinterIcon className="h-3 w-3" />
          </div>
          <div className="px-2">Generate Invoice</div>
        </div>
      </DialogTrigger>
      <DialogContent className="h-[90%] overflow-y-auto sm:min-w-[1200px]">
        <DialogHeader>
          <DialogTitle>Invoice ({sales.voucher_number})</DialogTitle>
        </DialogHeader>
        <PDFExport
          ref={pdfExportComponent}
          paperSize="auto"
          fileName={`Report for ${new Date().getFullYear()}`}
          author={'Madhav Auto'}
        >
          <div ref={container}>
            <div className="grid gap-4 text-sm">
              <div className="flex items-center justify-center pb-8">
                <p className="text-lg font-bold uppercase text-primary">
                  Madhav Auto and Energy Solutions
                </p>
              </div>
              <div className="gap- grid grid-cols-4 items-center border border-primary bg-primary p-4 text-sm font-semibold text-white">
                <div className="col-span-1">
                  Date : {new Date(sales.date as string).toLocaleDateString()}
                </div>
                <div>Vocuher Number : {sales.voucher_number}</div>
                <div>GSTIN : {sales.gstin_uin}</div>
                <div>Location : {sales.products[0].godown}</div>
              </div>
            </div>
            <div className="flex items-center justify-between py-8 text-sm">
              <div className="flex w-1/3 flex-col font-semibold">
                <p className="mb-1">From,</p>
                <p>Madhav Auto and Energy Solutions</p>
                <p>
                  {' '}
                  S No.3, P No.6/3A, K No 192 Sai Serinity Layout, K R Puram Bengaluru
                  Karnataka,560049
                </p>
                <p>Ph No. : 9449967878 </p>
                <p>Email : info@madhavauto.in </p>
              </div>
              <div className="flex w-1/3 flex-col font-semibold">
                <p className="mb-1">To,</p>
                <p>{sales.customers.customer_name}</p>
                <p>{sales.customers.address}</p>
                <p>Ph No. : {sales.customers.mobile_number} </p>
                <p>Email : {sales.customers.email !== '' ? sales.customers.email : ''} </p>
              </div>
            </div>
            <div className="grid grid-cols-7 border text-sm">
              <div className="border-r bg-gray-200/30 px-3 py-2 font-semibold">Product</div>
              <div className="border-r bg-gray-200/30 px-2 py-2 font-semibold">Product Code</div>
              <div className="border-r bg-gray-200/30 px-2 py-2 font-semibold">Price</div>
              <div className="border-r bg-gray-200/30 px-2 py-2 font-semibold">Quantity</div>
              <div className="border-r bg-gray-200/30 px-2 py-2 font-semibold">Tax</div>
              <div className="border-r bg-gray-200/30 px-2 py-2 font-semibold">Discount</div>
              <div className="bg-gray-200/30 px-2 py-2 font-semibold">Total Price</div>
            </div>
            <div className="grid grid-cols-7 border border-t-0 text-sm">
              {sales.products.map((i) => (
                <>
                  <div className="border-b border-r px-3 py-2 font-medium">{i.name}</div>
                  <div className="border-b border-r px-2 py-2 font-medium">{i.product_code}</div>
                  <div className="border-b border-r px-2 py-2 font-medium">₹ {i.rate}</div>
                  <div className="border-b border-r px-2 py-2 font-medium">
                    {sales.billed_quantity}
                  </div>
                  <div className="border-b border-r px-2 py-2 font-medium">{i.rate_of_gst}%</div>
                  <div className="border-b border-r px-2 py-2 font-medium">{i.discount}%</div>
                  <div className="border-b px-2 py-2 font-medium">
                    ₹ {Number(Number(i.rate) * Number(i.quantity)).toFixed(2)}
                  </div>
                </>
              ))}

              <div className="col-span-4 border-b border-r px-2 py-4 font-bold">Total</div>
              <div className="col-span-1 border-b border-r px-2 py-4 font-semibold">
                ₹
                {(
                  (sales.total_amount *
                    sales.products.reduce((i, j) => i + Number(j.rate_of_gst), 0)) /
                  100
                ).toFixed(2)}
              </div>
              <div className="col-span-1 border-b border-r px-2 py-4 font-semibold">
                ₹
                {(
                  (sales.products.reduce((i, j) => i + Number(j.discount), 0) *
                    sales.products.reduce((i, j) => i + Number(j.rate_of_gst), 0)) /
                  100
                ).toFixed(2)}
              </div>
              <div className="col-span-1 border-b border-r px-2 py-4 font-semibold">
                ₹{sales.total_amount.toFixed(2)}
              </div>
              <div className="col-span-6 border-b border-r px-2 py-4 font-bold">Order Number</div>
              <div className="col-span-1 border-b border-r px-2 py-4 font-semibold">
                {sales.order_number}
              </div>
              <div className="col-span-6 border-b border-r px-2 py-4 font-bold">Order Due Date</div>
              <div className="col-span-1 border-b border-r px-2 py-4 font-semibold">
                {sales.order_due_date}
              </div>
            </div>
            <div className="px-2 py-5">
              <p className="text-sm font-bold">
                Purchases Note :{' '}
                <span className="font-medium">
                  {sales.sales_note !== '' ? sales.sales_note : 'N/A'}
                </span>
              </p>
              <p className="py-1 text-sm font-bold">
                Remarks :{' '}
                <span className="font-medium">
                  {sales.staff_remarks !== '' ? sales.staff_remarks : 'N/A'}
                </span>
              </p>
              <div className="flex justify-between">
                <p className="flex py-1 text-sm font-bold">
                  Created By :{' '}
                  <span className="font-medium">
                    Apoorva Kumar <br />
                  </span>
                </p>
                <p className="flex px-10 py-1 text-sm font-semibold">Signature</p>
              </div>
            </div>
          </div>
        </PDFExport>
        <DialogFooter>
          <Button onClick={exportPDFWithMethod} className="flex space-x-3 rounded">
            <DownloadIcon className="h-4 w-4" /> <div>Download</div>{' '}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
