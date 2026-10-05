import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

/** Groups related fields under one heading. `disabled` disables every control inside. */
function FieldSet({ className, ...props }: ComponentProps<'fieldset'>) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        'grid min-w-0 gap-4',
        // Controls dim themselves when disabled; the legend and labels follow them.
        '[&:disabled_:is([data-slot=field-legend],[data-slot=label])]:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

type FieldLegendProps = ComponentProps<'legend'> & {
  /**
   * `legend` heads a section of fields. `label` names a single choice made of several
   * controls, such as a radio group, and matches Label.
   */
  variant?: 'legend' | 'label';
};

/** The FieldSet's heading. Screen readers announce it as the name of the group. */
function FieldLegend({ className, variant = 'legend', ...props }: FieldLegendProps) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        'mb-3 font-medium text-foreground',
        'data-[variant=label]:text-sm data-[variant=label]:leading-5',
        'data-[variant=legend]:text-[1rem] data-[variant=legend]:leading-6 data-[variant=legend]:tracking-[-0.01em]',
        className,
      )}
      {...props}
    />
  );
}

export { FieldSet, FieldLegend, type FieldLegendProps };
