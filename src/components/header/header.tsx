'use client';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserNav } from '@/components/header/user-nav';
import { SheetMenu } from '@/components/header/sheet-menu';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';
import { useStore } from '@/hooks/use-store';
import { Button } from '../ui/button';
import { MenuIcon } from 'lucide-react';
import { UploadIcon } from '@radix-ui/react-icons';
import api from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Upload } from '@/app/_components/upload/upload';

interface NavbarProps {
  title: string;
}

export function Header({ title }: NavbarProps) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background shadow-sm dark:shadow-secondary">
      <div className="mr-8 flex h-20 items-center">
        <div className="flex items-center space-x-4">
          <SheetMenu />

          <h1 className="hidden px-4 text-[20px] font-bold uppercase leading-[20px] text-primary dark:text-muted-foreground lg:block">
            {title}
          </h1>
          <h1 className="block px-4 text-[20px] font-bold uppercase leading-[20px] text-primary dark:text-muted-foreground lg:hidden">
            Madhav A&ES
          </h1>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-5">
          <Upload />
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
