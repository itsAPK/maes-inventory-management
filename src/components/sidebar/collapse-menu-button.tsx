'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, ChevronRight, Dot, LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DropdownMenuArrow } from '@radix-ui/react-dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

interface CollapseMenuButtonProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  submenus: Submenu[];
  isOpen: boolean | undefined;
}

export function CollapseMenuButton({
  icon: Icon,
  label,
  active,
  submenus,
  isOpen,
}: CollapseMenuButtonProps) {
  const isSubmenuActive = submenus.some((submenu) => submenu.active);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive);

  return isOpen ? (
    <Collapsible open={isCollapsed} onOpenChange={setIsCollapsed} className="w-full">
      <CollapsibleTrigger className="mb-1 [&[data-state=open]>div>div>svg]:rotate-90" asChild>
        <Button
          variant={'ghost'}
          className={cn('w-full rounded-none', active ? 'h-[53px]' : 'h-10')}
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center">
              <div
                className={cn(
                  'mr-4 flex h-full items-center rounded-none text-primary',
                  !isOpen ? 'px-3 py-5' : 'px-3 py-3',
                )}
              >
                <Icon size={20} />
              </div>
              <p
                className={cn(
                  'max-w-[150px] truncate text-[15px] font-normal',
                  isOpen ? 'translate-x-0 opacity-100' : '-translate-x-96 opacity-0',
                )}
              >
                {label}
              </p>
            </div>
            <div
              className={cn(
                'whitespace-nowrap',
                isOpen ? 'translate-x-0 opacity-100' : '-translate-x-96 opacity-0',
              )}
            >
              <ChevronRight size={18} className="transition-transform duration-200" />
            </div>
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
        {submenus.map(({ href, label, active }, index) => (
          <Button
            key={index}
            variant={'ghost'}
            className={cn(
              !active ? 'h-10 bg-transparent' : 'h-[53px] bg-primary/20',
              'mr-4 mt-1 w-full items-center justify-start rounded-none',
              !isOpen ? 'px-3' : 'px-3',
            )}
            asChild
          >
            <Link href={href}>
              <span className="ml-12 mr-2"></span>
              <p
                className={cn(
                  'max-w-[170px] truncate text-[15px] font-normal',
                  isOpen ? 'translate-x-0 opacity-100' : '-translate-x-96 opacity-0',
                )}
              >
                {label}
              </p>
            </Link>
          </Button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ) : (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant={'ghost'}
                size={'icon'}
                className={cn(
                  'ml-4 h-[53px] w-full',
                  active && isOpen ? 'rounded-none bg-primary/20' : 'hover:bg-transparent',
                )}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={cn(
                        !active ? 'bg-transparent text-primary' : 'bg-primary text-white',
                        isOpen === false ? '' : '',
                        'flex h-full items-center rounded-lg px-3 py-3',
                      )}
                    >
                      <Icon size={20} />
                    </div>
                    <p
                      className={cn(
                        'max-w-[200px] truncate',
                        isOpen === false ? 'opacity-0' : 'opacity-100',
                      )}
                    >
                      {label}
                    </p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" align="start" alignOffset={2}>
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent side="right" sideOffset={25} align="start">
        <DropdownMenuLabel className="max-w-[190px] truncate">{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {submenus.map(({ href, label }, index) => (
          <DropdownMenuItem key={index} asChild>
            <Link className="cursor-pointer" href={href}>
              <p className="max-w-[180px] truncate">{label}</p>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuArrow className="fill-border" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
