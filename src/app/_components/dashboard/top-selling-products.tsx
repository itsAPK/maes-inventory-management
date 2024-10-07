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

export const TopSellingProducts = ({
  data,
  dateRage,
}: {
  data: {
    _id: {
      name: string;
      product_code: string;
    };
    total_quantity_sold: number;
    total_amount: number;
    product_name: string;
    product_code: string;
  }[];
  dateRage: DateRange;
}) => {
  return (
    <Card className="rounded shadow-none">
      <CardHeader className="px-7">
        <CardTitle>Top Selling Products</CardTitle>
        <CardDescription>
          List Selling Productsfrom {dateRage.from!.toLocaleDateString()} to{' '}
          {dateRage.to!.toLocaleDateString()} .
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Product Code</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((i, index) => (
              <TableRow key={i._id.name} className={index % 2 === 0 ? 'bg-accent' : ''}>
                <TableCell>
                  <div className="text-xs">{i._id.name}</div>
                </TableCell>
                <TableCell>
                  <div className="text-xs">{i._id.product_code}</div>
                </TableCell>
                <TableCell>
                  <div className="text-xs">{i.total_quantity_sold}</div>
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
