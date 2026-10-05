import type { ComponentProps } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const alertVariants = cva(
  'grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[1rem_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5',
  {
    variants: {
      variant: {
        neutral: 'border-border bg-card text-card-foreground [&>svg]:text-muted-foreground',
        brand: 'border-transparent bg-brand-subtle text-foreground [&>svg]:text-brand-text',
        success: 'border-transparent bg-success-subtle text-foreground [&>svg]:text-success-text',
        warning: 'border-transparent bg-warning-subtle text-foreground [&>svg]:text-warning-text',
        danger: 'border-transparent bg-danger-subtle text-foreground [&>svg]:text-danger-text',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
);

type AlertProps = ComponentProps<'div'> & VariantProps<typeof alertVariants>;

function Alert({ className, variant, role = 'alert', ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      role={role}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn('col-start-2 font-medium tracking-[-0.01em]', className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn('col-start-2 grid gap-1 text-sm [&_p]:leading-5', className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, alertVariants, type AlertProps };
