'use client';
import { CommandGroup, CommandItem, CommandList, CommandInput } from './command';
import { Command as CommandPrimitive } from 'cmdk';
import { useState, useRef, useCallback, type KeyboardEvent } from 'react';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { Skeleton } from '@/components/ui/skeleton';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export type Option = Record<'value' | 'label', string> & Record<string, string>;

type AutoCompleteProps = {
  options: Option[];
  emptyMessage: string;
  value?: Option;
  onValueChange?: (value: Option) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  onSearch?: (value: string) => void;
};

type AutoCompleteTriggerProps = {
  options: Option[];
  placeholder: string;
  value?: string | string[];
};

export const AutoComplete = ({
  options,
  placeholder,
  emptyMessage,
  value,
  onValueChange,
  disabled,
  onSearch,
  isLoading = false,
}: AutoCompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option>(value as Option);
  const [inputValue, setInputValue] = useState<string>(value?.label || '');

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      // Keep the options displayed when the user is typing
      if (!isOpen) {
        setOpen(true);
      }

      // This is not a default behaviour of the <input /> field
      if (event.key === 'Enter' && input.value !== '') {
        const optionToSelect = options.find((option) => option.label === input.value);
        if (optionToSelect) {
          setSelected(optionToSelect);
          onValueChange?.(optionToSelect);
        }
      }

      if (event.key === 'Escape') {
        input.blur();
      }
    },
    [isOpen, options, onValueChange],
  );

  const handleBlur = useCallback(() => {
    setOpen(false);
    // setInputValue(selected?.label);
  }, [selected]);

  const handleSelectOption = useCallback(
    (selectedOption: Option) => {
      setInputValue(selectedOption.label);

      setSelected(selectedOption);
      onValueChange?.(selectedOption);

      // This is a hack to prevent the input from being focused after the user selects an option
      // We can call this hack: "The next tick"
      setTimeout(() => {
        inputRef?.current?.blur();
      }, 0);
    },
    [onValueChange],
  );

  return (
    <CommandPrimitive onKeyDown={handleKeyDown} className="bg-background">
      <CommandInput
        ref={inputRef}
        onValueChange={(e) => {
          // if (!isLoading) {
          //   setInputValue(e);
          // }
          onSearch!(e);
        }}
        onBlur={handleBlur}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        disabled={disabled}
        className="h-9 w-[400px] bg-background text-[15px] lg:w-[860px]"
      />

      <CommandList>
        {isLoading ? (
          <CommandPrimitive.Loading>
            <div className="p-1">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </CommandPrimitive.Loading>
        ) : null}
        {options.length > 0 && !isLoading ? (
          <CommandGroup className="" onSelect={(e) => e.preventDefault()}>
            {options.map((option) => {
              const isSelected = selected?.value === option.value;
              return (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                  onSelect={() => handleSelectOption(option)}
                  className={cn('flex w-full gap-2', !isSelected ? 'pl-8' : null)}
                >
                  {isSelected ? <Check className="w-4" /> : null}
                  {option.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        ) : null}
        {!isLoading ? (
          <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm">
            {emptyMessage}
          </CommandPrimitive.Empty>
        ) : null}
      </CommandList>
    </CommandPrimitive>
  );
};

export const AutoCompleteTrigger = ({ options, placeholder, value }: AutoCompleteTriggerProps) => {
  return (
    <button
      type="button"
      role="combobox"
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-[8px] border border-input px-4 py-[12px] text-[15px] text-sm text-[#696969] transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
        'border-[#f0f5f7] bg-[#f0f5f7] text-[#696969] ring-[1px] ring-black/10 placeholder:text-[15px] placeholder:text-[#9d9d9d] focus-visible:bg-transparent focus-visible:ring-primary',
        !value && 'text-[#9d9d9d]',
      )}
    >
      {value
        ? options.find((option) => option.value === value)?.label
        : 'Select Company Est. Since'}{' '}
      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </button>
  );
};
