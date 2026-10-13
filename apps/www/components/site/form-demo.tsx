'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/registry/sanjou/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/registry/sanjou/ui/form';
import { Input } from '@/registry/sanjou/ui/input';

const schema = z.object({
  slug: z
    .string()
    .min(3, 'Use at least 3 characters.')
    .regex(/^[a-z0-9-]*$/, 'Use only lowercase letters, numbers and hyphens.'),
});

export function FormDemo() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { slug: '' },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(({ slug }) => toast.success(`Workspace renamed to ${slug}`))}
        noValidate
        className="grid w-full max-w-sm gap-4"
      >
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workspace slug</FormLabel>
              <FormControl>
                <Input placeholder="acme-production" autoComplete="off" {...field} />
              </FormControl>
              <FormDescription>Shown in the URL and in invites.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="justify-self-start">
          Save slug
        </Button>
      </form>
    </Form>
  );
}
