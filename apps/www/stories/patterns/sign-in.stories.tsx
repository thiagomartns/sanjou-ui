import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { expect, fn, waitFor } from 'storybook/test';
import { z } from 'zod';

import { Alert, AlertDescription, AlertTitle } from '@/registry/sanjou/ui/alert';
import { Button } from '@/registry/sanjou/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/registry/sanjou/ui/card';
import { Checkbox } from '@/registry/sanjou/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/registry/sanjou/ui/form';
import { Input } from '@/registry/sanjou/ui/input';

const schema = z.object({
  email: z.email('Enter the email linked to your workspace.'),
  password: z.string().min(1, 'Enter your password.'),
  remember: z.boolean(),
});

type Values = z.infer<typeof schema>;

type SignInFormProps = {
  onSubmit: (values: Values) => void;
  /** A server-side failure, such as wrong credentials. */
  error?: string;
};

function SignInForm({ onSubmit, error }: SignInFormProps) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', remember: false },
  });

  // A failed attempt marks both fields invalid; the Alert carries the message.
  useEffect(() => {
    if (!error) return;
    form.setError('email', { type: 'server' });
    form.setError('password', { type: 'server' });
  }, [error, form]);

  return (
    <Card className="w-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit((values) => onSubmit(values))} noValidate>
          <CardHeader>
            <CardTitle>Sign in to Sanjou</CardTitle>
            <CardDescription>Use the email linked to your workspace.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {error && (
              <Alert variant="danger">
                <CircleAlert />
                <AlertTitle>Could not sign in</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="current-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      ref={field.ref}
                      name={field.name}
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormLabel>Remember me</FormLabel>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="justify-between">
            <Button type="button" variant="ghost">
              Reset password
            </Button>
            <Button type="submit">Sign in</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

const meta = {
  title: 'Patterns/Sign in',
  component: SignInForm,
  parameters: {
    docs: {
      description: {
        component: `A sign-in form built with Form: labeled fields, validation before submit, and a submit button. A failed attempt shows an Alert above the fields and marks them invalid.`,
      },
    },
    layout: 'centered',
  },
  args: { onSubmit: fn() },
} satisfies Meta<typeof SignInForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const email = canvas.getByLabelText('Email');
    const password = canvas.getByLabelText('Password');
    const remember = canvas.getByRole('checkbox', { name: 'Remember me' });
    const submit = canvas.getByRole('button', { name: 'Sign in' });

    await userEvent.tab();
    await expect(email).toHaveFocus();
    await userEvent.keyboard('ada@sanjou.dev');
    await userEvent.tab();
    await expect(password).toHaveFocus();
    await userEvent.keyboard('correct horse');
    await userEvent.tab();
    await expect(remember).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(remember).toBeChecked();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Reset password' })).toHaveFocus();
    await userEvent.tab();
    await expect(submit).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    await waitFor(() =>
      expect(args.onSubmit).toHaveBeenCalledWith({
        email: 'ada@sanjou.dev',
        password: 'correct horse',
        remember: true,
      }),
    );
  },
};

export const Validation: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Sign in' }));

    const email = canvas.getByLabelText('Email');
    // Focus moves before the messages render, so wait for both.
    await waitFor(() => expect(email).toHaveFocus());
    await waitFor(() =>
      expect(email).toHaveAccessibleDescription('Enter the email linked to your workspace.'),
    );
    await expect(canvas.getByLabelText('Password')).toHaveAccessibleDescription(
      'Enter your password.',
    );
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

export const WithError: Story = {
  args: { error: 'The email or password is incorrect. Try again or reset your password.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('Could not sign in');
    await waitFor(() =>
      expect(canvas.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true'),
    );
  },
};
