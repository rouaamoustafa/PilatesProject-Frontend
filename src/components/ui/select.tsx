import React from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';

export const Select = RadixSelect.Root;

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof RadixSelect.Trigger>,
  React.ComponentPropsWithoutRef<typeof RadixSelect.Trigger>
>(({ className, children, ...props }, ref) => (
  <RadixSelect.Trigger
    ref={ref}
    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-teal-300 ${className}`}
    {...props}
  >
    {children}
    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
  </RadixSelect.Trigger>
));
SelectTrigger.displayName = 'SelectTrigger';

export const SelectValue = RadixSelect.Value;

export const SelectIcon = RadixSelect.Icon;

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof RadixSelect.Content>,
  React.ComponentPropsWithoutRef<typeof RadixSelect.Content>
>(({ className, children, ...props }, ref) => (
  <RadixSelect.Portal>
    <RadixSelect.Content
      ref={ref}
      className={`z-50 overflow-hidden rounded-lg border bg-white shadow-lg ${className}`}
      {...props}
    >
      <RadixSelect.Viewport className="p-1">{children}</RadixSelect.Viewport>
    </RadixSelect.Content>
  </RadixSelect.Portal>
));
SelectContent.displayName = 'SelectContent';

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof RadixSelect.Item>,
  React.ComponentPropsWithoutRef<typeof RadixSelect.Item>
>(({ className, children, ...props }, ref) => (
  <RadixSelect.Item
    ref={ref}
    className={`relative flex cursor-pointer select-none items-center rounded px-2 py-1 text-sm outline-none focus:bg-teal-100 ${className}`}
    {...props}
  >
    <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    <RadixSelect.ItemIndicator className="absolute left-0 inline-flex items-center pl-1">
      <Check className="h-4 w-4 text-teal-500" />
    </RadixSelect.ItemIndicator>
  </RadixSelect.Item>
));
SelectItem.displayName = 'SelectItem';
