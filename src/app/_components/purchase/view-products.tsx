import { BoxIcon } from 'lucide-react';
import { Product } from '../product/list/columns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
interface ViewProductProps {
  product: Product[];
}

export const ViewProducts = ({ product }: ViewProductProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex">
          <div className="mt-1">
            <BoxIcon className="h-3 w-3" />
          </div>
          <div className="px-2">View Products</div>
        </div>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto sm:min-w-[1000px]">
        <DialogHeader>
          <DialogTitle>View Products</DialogTitle>
        </DialogHeader>
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
            {product.map((i) => (
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
      </DialogContent>
    </Dialog>
  );
};
