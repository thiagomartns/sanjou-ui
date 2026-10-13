'use client';

import type { CSSProperties, ComponentProps } from 'react';
import { CircleAlert, CircleCheck, Info, LoaderCircle, TriangleAlert } from 'lucide-react';
import { Toaster as Sonner } from 'sonner';

import { cn } from '@/lib/utils';

// Sonner reads its colors from these variables. Pointing them at the semantic tokens makes
// toasts follow the `.dark` class like every other component, without a theme prop.
const tokenStyle = {
  '--normal-bg': 'var(--color-popover)',
  '--normal-text': 'var(--color-popover-foreground)',
  '--normal-border': 'var(--color-border)',
  '--success-bg': 'var(--color-success-subtle)',
  '--success-text': 'var(--color-success-text)',
  '--success-border': 'var(--color-border)',
  '--info-bg': 'var(--color-brand-subtle)',
  '--info-text': 'var(--color-brand-text)',
  '--info-border': 'var(--color-border)',
  '--warning-bg': 'var(--color-warning-subtle)',
  '--warning-text': 'var(--color-warning-text)',
  '--warning-border': 'var(--color-border)',
  '--error-bg': 'var(--color-danger-subtle)',
  '--error-text': 'var(--color-danger-text)',
  '--error-border': 'var(--color-border)',
  '--border-radius': 'var(--radius-md)',
} as CSSProperties;

/** Mount once, near the root. Show toasts with `toast()` from `sonner`. */
function Toaster({ className, style, toastOptions, ...props }: ComponentProps<typeof Sonner>) {
  return (
    <Sonner
      data-slot="toaster"
      className={cn('toaster group font-sans', className)}
      style={{ ...tokenStyle, ...style }}
      icons={{
        success: <CircleCheck className="size-4" />,
        info: <Info className="size-4" />,
        warning: <TriangleAlert className="size-4" />,
        error: <CircleAlert className="size-4" />,
        loading: <LoaderCircle className="size-4 animate-spin" />,
      }}
      toastOptions={{
        ...toastOptions,
        classNames: {
          // Sonner's own styles set these with attribute selectors, so the tokens need `!`.
          toast: 'text-sm! shadow-md!',
          description: 'text-muted-foreground! in-data-[rich-colors=true]:text-current!',
          actionButton: 'bg-primary! text-primary-foreground! rounded-sm!',
          cancelButton: 'bg-muted! text-foreground! rounded-sm!',
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
