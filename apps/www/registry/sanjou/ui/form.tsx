'use client';

import { createContext, useContext, useId, type ComponentProps } from 'react';
import type * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Label } from '@/registry/sanjou/ui/label';

/** The `react-hook-form` provider: pass it the object returned by `useForm()`. */
const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = { name: TName };

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

/** A `react-hook-form` `Controller` that shares the field name with the parts inside it. */
function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

const FormItemContext = createContext<{ id: string } | null>(null);

/** Field state and the ids that tie the label, control, description and message together. */
function useFormField() {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  if (!fieldContext) throw new Error('useFormField must be used inside <FormField>.');
  if (!itemContext) throw new Error('useFormField must be used inside <FormItem>.');

  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

function FormItem({ className, ...props }: ComponentProps<'div'>) {
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div data-slot="form-item" className={cn('grid gap-1.5', className)} {...props} />
    </FormItemContext.Provider>
  );
}

function FormLabel(props: ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField();

  return <Label data-slot="form-label" data-error={!!error} htmlFor={formItemId} {...props} />;
}

/** Passes the id, `aria-invalid` and `aria-describedby` to its only child, the control. */
function FormControl(props: ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId}
      aria-invalid={!!error}
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: ComponentProps<'p'>) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

/** The field's validation message, or `children` when the field has no error. */
function FormMessage({ className, children, ...props }: ComponentProps<'p'>) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message ?? '') : children;
  if (!body) return null;

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn('text-sm text-danger-text', className)}
      {...props}
    >
      {body}
    </p>
  );
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
