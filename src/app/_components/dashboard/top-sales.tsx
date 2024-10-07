import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { DateRange } from 'react-day-picker';

export const TopSales = ({
  data,
  dateRage,
}: {
  data: {
    voucher_number: string;
    date: string; // You can also use Date type if you'll be working with Date objects instead of strings
    party_name: string;
    item_name: string;
    item_part_no: string;
    billed_quantity: number;
    rate: number;
    total_amount: number;
  }[];
  dateRage: DateRange;
}) => {
  return (
    <Card className="rounded shadow-none">
      <CardHeader className="px-7">
        <CardTitle>Top Sales</CardTitle>
        <CardDescription>
          List Top Sales from {dateRage.from!.toLocaleDateString()} to{' '}
          {dateRage.to!.toLocaleDateString()} .
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Voucher No.</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Product Code</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((i, index) => (
              <TableRow key={i.voucher_number} className={index % 2 === 0 ? 'bg-accent' : ''}>
                <TableCell>
                  <div className="text-xs">{new Date(i.date).toISOString().split('T')[0]}</div>
                </TableCell>
                <TableCell>
                  <div className="text-xs">{i.voucher_number}</div>
                </TableCell>
                <TableCell>
                  <div className="text-xs">{i.party_name}</div>
                </TableCell>
                <TableCell>
                  <div className="text-xs">{i.item_name}</div>
                </TableCell>
                <TableCell>
                  <div className="text-xs">{i.item_part_no}</div>
                </TableCell>
                <TableCell>
                  <div className="text-center text-xs">{i.billed_quantity}</div>
                </TableCell>
                <TableCell>
                  <div className="text-xs">₹ {i.rate.toFixed(2)}</div>
                </TableCell>
                <TableCell>
                  <div className="text-xs">₹ {i.total_amount.toFixed(2)}</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
