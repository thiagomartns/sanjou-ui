import { useEffect, type ComponentProps, type ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/sanjou/ui/button';
import { Checkbox } from '@/registry/sanjou/ui/checkbox';
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

import placeholderImage from './auth-placeholder.svg';

// The auth pattern: screens the app copies and adapts, not a published component.
// Each form only renders: it gets onSubmit, loading and error, and the app does the rest.

/** A transparent GIF: what `<img>` loads below 1024px, where the image column is hidden. */
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

type AuthLayoutProps = {
  children: ReactNode;
  /** Decorative picture for the left column. */
  image?: string;
  /** Moves the focal point, e.g. `object-[30%_center]`. */
  imageClassName?: string;
};

/**
 * Image on the left, form panel on the right: clamp(24rem, 25%, 32rem). Below 1024px only the
 * panel shows. `--auth-min-height` lets a docs page shrink the full-height screen.
 */
export function AuthLayout({
  children,
  image = placeholderImage,
  imageClassName,
}: AuthLayoutProps) {
  return (
    <div className="grid min-h-[var(--auth-min-height,100svh)] bg-background lg:grid-cols-[1fr_clamp(24rem,25%,32rem)]">
      <div className="relative hidden overflow-hidden lg:block">
        {/* The source only matches from 1024px up, so phones never download the picture. */}
        <picture>
          <source media="(min-width: 1024px)" srcSet={image} />
          <img
            src={BLANK}
            alt=""
            className={cn('absolute inset-0 size-full object-cover object-center', imageClassName)}
          />
        </picture>
      </div>
      <div className="flex items-center justify-center px-4 py-8 lg:px-8">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}

/** Stands in for the app's logo. Replace it with your own mark. */
function LogoPlaceholder() {
  return (
    <div
      role="img"
      aria-label="Acme"
      className="flex h-8 w-24 items-center justify-center rounded-md bg-muted text-sm font-medium text-muted-foreground"
    >
      Logo
    </div>
  );
}

function AuthHeader({ title, description }: { title: string; description: ReactNode }) {
  return (
    <div className="grid justify-items-center gap-6 text-center">
      <LogoPlaceholder />
      <div className="grid gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

/** A text link. The design system has no Link component yet. */
function TextLink({ className, children, ...props }: ComponentProps<'a'>) {
  return (
    <a
      className={cn(
        'rounded-sm text-sm font-medium text-brand-text underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

function AuthFooter({ children }: { children: ReactNode }) {
  return <p className="text-center text-sm text-muted-foreground">{children}</p>;
}

function SubmitButton({
  loading,
  children,
  loadingText,
}: {
  loading?: boolean;
  children: string;
  loadingText: string;
}) {
  return (
    <Button type="submit" className="w-full" disabled={loading}>
      {loading && <LoaderCircle className="animate-spin" aria-hidden />}
      {loading ? loadingText : children}
    </Button>
  );
}

type FormScreenProps<T> = {
  onSubmit: (values: T) => void;
  /** True while the request runs: the submit button is disabled and says what is happening. */
  loading?: boolean;
  defaultValues?: Partial<T>;
};

const email = z.email('Enter the email linked to your workspace.');

// Sign in

const signInSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password.'),
  remember: z.boolean(),
});

export type SignInValues = z.infer<typeof signInSchema>;

type SignInFormProps = FormScreenProps<SignInValues> & {
  /** A server-side failure. The app shows the reason in a Toast; the form marks both fields. */
  error?: string;
};

export function SignInForm({ onSubmit, loading, error, defaultValues }: SignInFormProps) {
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '', remember: false, ...defaultValues },
  });

  // Both fields are marked, without a message, so the screen does not reveal which one was wrong.
  useEffect(() => {
    if (!error) return;
    form.setError('email', { type: 'server' }, { shouldFocus: true });
    form.setError('password', { type: 'server' });
  }, [error, form]);

  return (
    <div className="grid gap-6">
      <AuthHeader title="Sign in" description="Use the email linked to your workspace." />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => onSubmit(values))}
          noValidate
          className="grid gap-6"
        >
          <div className="grid gap-4">
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
          </div>
          <div className="flex items-center justify-between gap-4">
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
            <TextLink href="#forgot-password">Forgot password?</TextLink>
          </div>
          <SubmitButton loading={loading} loadingText="Signing in…">
            Sign in
          </SubmitButton>
        </form>
      </Form>
      <AuthFooter>
        Don’t have an account? <TextLink href="#create-account">Create account</TextLink>
      </AuthFooter>
    </div>
  );
}

// Create account

const createAccountSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name.'),
  email,
  password: z.string().min(8, 'Enter a password with at least 8 characters.'),
});

export type CreateAccountValues = z.infer<typeof createAccountSchema>;

export function CreateAccountForm({
  onSubmit,
  loading,
  defaultValues,
}: FormScreenProps<CreateAccountValues>) {
  const form = useForm<CreateAccountValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: { name: '', email: '', password: '', ...defaultValues },
  });

  return (
    <div className="grid gap-6">
      <AuthHeader title="Create an account" description="Start your workspace in a few steps." />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => onSubmit(values))}
          noValidate
          className="grid gap-6"
        >
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input autoComplete="name" placeholder="Ada Lovelace" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    <Input type="password" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormDescription>Use at least 8 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <SubmitButton loading={loading} loadingText="Creating account…">
            Create account
          </SubmitButton>
        </form>
      </Form>
      <AuthFooter>
        Already have an account? <TextLink href="#sign-in">Sign in</TextLink>
      </AuthFooter>
    </div>
  );
}

// Forgot password

const forgotPasswordSchema = z.object({ email });

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm({
  onSubmit,
  loading,
  defaultValues,
}: FormScreenProps<ForgotPasswordValues>) {
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '', ...defaultValues },
  });

  return (
    <div className="grid gap-6">
      <AuthHeader
        title="Reset your password"
        description="Enter your email and we will send you a link to reset your password."
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => onSubmit(values))}
          noValidate
          className="grid gap-6"
        >
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
          <SubmitButton loading={loading} loadingText="Sending link…">
            Send reset link
          </SubmitButton>
        </form>
      </Form>
      <AuthFooter>
        <TextLink href="#sign-in">Back to sign in</TextLink>
      </AuthFooter>
    </div>
  );
}

// Verify email

type VerifyEmailProps = {
  email: string;
  onResend: () => void;
  loading?: boolean;
};

export function VerifyEmail({ email: address, onResend, loading }: VerifyEmailProps) {
  return (
    <div className="grid gap-6">
      <AuthHeader
        title="Check your email"
        description={`We sent a verification link to ${address}. Open it to finish creating your account.`}
      />
      <Button variant="outline" className="w-full" onClick={onResend} disabled={loading}>
        {loading && <LoaderCircle className="animate-spin" aria-hidden />}
        {loading ? 'Sending email…' : 'Resend email'}
      </Button>
      <AuthFooter>
        Wrong email? <TextLink href="#create-account">Use another address</TextLink>
      </AuthFooter>
    </div>
  );
}
