import type { ComponentProps } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex h-5 w-fit shrink-0 items-center gap-1 rounded-sm border border-transparent px-1.5 text-xs font-medium whitespace-nowrap [&>svg]:size-3',
  {
    variants: {
      variant: {
        neutral: 'bg-secondary text-secondary-foreground',
        outline: 'border-border text-foreground',
        brand: 'bg-brand-subtle text-brand-text',
        success: 'bg-success-subtle text-success-text',
        warning: 'bg-warning-subtle text-warning-text',
        danger: 'bg-danger-subtle text-danger-text',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
);

type BadgeProps = ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    /** Leading status dot in the badge's text color. */
    dot?: boolean;
    asChild?: boolean;
  };

function Badge({
  className,
  variant,
  dot = false,
  asChild = false,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : 'span';
  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />}
      {children}
    </Comp>
  );
}

export { Badge, badgeVariants, type BadgeProps };
