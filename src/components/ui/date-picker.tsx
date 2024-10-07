'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CalendarIcon } from '@radix-ui/react-icons';
import { addDays, format } from 'date-fns';
import type { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DateRangePickerProps extends React.ComponentPropsWithoutRef<typeof PopoverContent> {
  /**
   * The selected date range.
   * @default undefined
   * @type DateRange
   * @example { from: new Date(), to: new Date() }
   */
  dateRange?: DateRange;

  /**
   * The number of days to display in the date range picker.
   * @default undefined
   * @type number
   * @example 7
   */
  dayCount?: number;

  /**
   * The placeholder text of the calendar trigger button.
   * @default "Pick a date"
   * @type string | undefined
   */
  placeholder?: string;

  /**
   * The variant of the calendar trigger button.
   * @default "outline"
   * @type "default" | "outline" | "secondary" | "ghost"
   */
  triggerVariant?: Exclude<ButtonProps['variant'], 'destructive' | 'link'>;

  /**
   * The size of the calendar trigger button.
   * @default "default"
   * @type "default" | "sm" | "lg"
   */
  triggerSize?: Exclude<ButtonProps['size'], 'icon'>;

  /**
   * The class name of the calendar trigger button.
   * @default undefined
   * @type string
   */
  triggerClassName?: string;

  value?: any;

  onChange?: (e: any) => void;
}

export function DatePicker({
  dateRange,
  dayCount,
  placeholder = 'Pick a date',
  triggerVariant = 'outline',
  triggerSize = 'default',
  triggerClassName,
  className,
  onChange,
  value,
  ...props
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<Date>();

  return (
    <div className="grid gap-2">
      <Popover modal>
        <PopoverTrigger asChild>
          <Button
            variant={triggerVariant}
            size={triggerSize}
            className={cn(
              'flex h-11 w-full justify-start rounded-none border border-input bg-[#f9f9f9] px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-foreground',
              !value && 'text-muted-foreground',
              triggerClassName,
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            <span className="text-sm">
              {' '}
              {value ? <>{format(value, 'LLL dd, y')}</> : <> {placeholder}</>}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn('z-[9999] w-auto p-0 text-xs', className)} {...props}>
          <Calendar
            initialFocus
            mode="single"
            selected={value}
            onSelect={(date) => onChange!(date?.toISOString()!)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
