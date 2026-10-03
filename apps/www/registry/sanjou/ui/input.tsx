import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-8 w-full min-w-0 rounded-md border border-input bg-background px-2.5 text-base text-foreground shadow-xs transition-colors duration-100 ease-standard outline-none',
        'placeholder:text-muted-foreground hover:border-gray-10',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'aria-invalid:border-destructive',
        'disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60',
        'file:mr-2 file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
