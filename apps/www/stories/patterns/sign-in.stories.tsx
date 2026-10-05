import type { FormEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleAlert } from 'lucide-react';
import { expect, fn } from 'storybook/test';

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
import { Input } from '@/registry/sanjou/ui/input';
import { Label } from '@/registry/sanjou/ui/label';

type SignInFormProps = {
  onSubmit: (values: { email: string; password: string; remember: boolean }) => void;
  error?: string;
};

function SignInForm({ onSubmit, error }: SignInFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSubmit({
      email: String(data.get('email')),
      password: String(data.get('password')),
      remember: data.get('remember') === 'on',
    });
  }

  return (
    <Card className="w-sm">
      <form onSubmit={handleSubmit} noValidate>
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
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              aria-invalid={error ? true : undefined}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={error ? true : undefined}
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="remember" name="remember" />
            <Label htmlFor="remember">Remember me</Label>
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <Button type="button" variant="ghost">
            Reset password
          </Button>
          <Button type="submit">Sign in</Button>
        </CardFooter>
      </form>
    </Card>
  );
}

const meta = {
  title: 'Patterns/Sign in',
  component: SignInForm,
  parameters: {
    docs: {
      description: {
        component: `A sign-in form with labeled fields and a submit button. A failed attempt shows an Alert above the fields.`,
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
    await expect(args.onSubmit).toHaveBeenCalledWith({
      email: 'ada@sanjou.dev',
      password: 'correct horse',
      remember: true,
    });
  },
};

export const WithError: Story = {
  args: { error: 'The email or password is incorrect. Try again or reset your password.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('Could not sign in');
    await expect(canvas.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  },
};
