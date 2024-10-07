import Link from 'next/link';
import { MenuIcon, PanelsTopLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Menu } from '@/components/sidebar/menu';
import { Sheet, SheetHeader, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="ml-4 lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full flex-col px-3 sm:w-72" side="left">
        <SheetHeader>
          <Button className="flex items-center justify-center pb-2 pt-1" variant="link" asChild>
            <Link href="/dashboard" className="flex items-center gap-2">
              <h1 className="text-lg font-bold">M A E S</h1>
            </Link>
          </Button>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}
