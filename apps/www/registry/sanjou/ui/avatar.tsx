'use client';

import type { ComponentProps } from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const avatarVariants = cva('relative flex shrink-0 overflow-hidden rounded-full select-none', {
  variants: {
    size: {
      sm: 'size-6 text-xs',
      md: 'size-8 text-sm',
      lg: 'size-10 text-base',
    },
  },
  defaultVariants: { size: 'md' },
});

function Avatar({
  className,
  size,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Root> & VariantProps<typeof avatarVariants>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(avatarVariants({ size }), className)}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn('aspect-square size-full object-cover', className)}
      {...props}
    />
  );
}

function AvatarFallback({ className, ...props }: ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        'flex size-full items-center justify-center rounded-full bg-secondary font-medium text-secondary-foreground',
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback, avatarVariants };
