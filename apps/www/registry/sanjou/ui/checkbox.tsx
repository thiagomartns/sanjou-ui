'use client';

import type { ComponentProps } from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';

import { cn } from '@/lib/utils';

function Checkbox({ className, ...props }: ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer grid size-4 shrink-0 place-items-center rounded-sm border border-input bg-background text-primary-foreground shadow-xs transition-colors duration-100 ease-standard outline-none',
        'hover:border-gray-10',
        'data-[state=checked]:border-primary data-[state=checked]:bg-primary',
        'data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'aria-invalid:border-destructive',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="group grid place-items-center [&>svg]:size-3"
      >
        <Check strokeWidth={3} className="group-data-[state=indeterminate]:hidden" />
        <Minus strokeWidth={3} className="hidden group-data-[state=indeterminate]:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
