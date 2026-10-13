import { useId, useState, type CSSProperties } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { toast } from 'sonner';
import { expect, fn, waitFor, within } from 'storybook/test';

import { Toaster } from '@/registry/sanjou/ui/sonner';

import {
  AuthLayout,
  CreateAccountForm,
  ForgotPasswordForm,
  SignInForm,
  VerifyEmail,
  type SignInValues,
} from './auth';

// The screens fill the viewport on the canvas. On the Docs page they get a fixed height, and
// the transform makes the frame the containing block of the fixed Toaster, so each example's
// toasts stay in its own corner.
const withAuthFrame: Decorator = (Story, context) => {
  if (context.viewMode !== 'docs') return <Story />;
  return (
    <div
      className="overflow-hidden rounded-lg border"
      style={{ '--auth-min-height': '720px', transform: 'translateZ(0)' } as CSSProperties}
    >
      <Story />
    </div>
  );
};

const meta = {
  title: 'Patterns/Auth',
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  decorators: [withAuthFrame],
  // Sonner keeps toasts in a module-level store; every story starts without any.
  beforeEach: () => {
    toast.dismiss();
  },
} satisfies Meta;

export default meta;

/** Stands in for the app: it calls the API, then answers with a Toast. */
function SignInDemo({ authenticate }: { authenticate: (values: SignInValues) => Promise<void> }) {
  const toasterId = useId();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  async function handleSubmit(values: SignInValues) {
    setLoading(true);
    setError(undefined);
    try {
      await authenticate(values);
      toast.success('Signed in', {
        toasterId,
        richColors: true,
        description: 'Welcome back, Ada.',
      });
    } catch {
      const reason = 'The email or password is incorrect.';
      setError(reason);
      toast.error('Could not sign in', { toasterId, richColors: true, description: reason });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AuthLayout>
        <SignInForm onSubmit={handleSubmit} loading={loading} error={error} />
      </AuthLayout>
      <Toaster id={toasterId} />
    </>
  );
}

type SignInStory = StoryObj<typeof SignInDemo>;

const render: SignInStory['render'] = (args) => <SignInDemo {...args} />;

function notifications(canvasElement: HTMLElement) {
  const body = within(canvasElement.ownerDocument.body);
  return within(body.getByRole('region', { name: /Notifications/ }));
}

export const SignIn: SignInStory = {
  name: 'Sign in',
  args: { authenticate: fn(async () => {}) },
  render,
  play: async ({ canvas, userEvent }) => {
    // Focus order: fields, Remember me, Forgot password?, submit, footer link. The logo is skipped.
    await userEvent.tab();
    await expect(canvas.getByLabelText('Email')).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByLabelText('Password')).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('checkbox', { name: 'Remember me' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'Forgot password?' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Sign in' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'Create account' })).toHaveFocus();
  },
};

export const FieldError: SignInStory = {
  name: 'Sign in: field error',
  args: { authenticate: fn(async () => {}) },
  render,
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
    await expect(args.authenticate).not.toHaveBeenCalled();
  },
};

export const Submitting: StoryObj<typeof SignInForm> = {
  name: 'Sign in: submitting',
  args: {
    onSubmit: fn(),
    loading: true,
    defaultValues: { email: 'ada@acme.com', password: 'correct horse' },
  },
  render: (args) => (
    <AuthLayout>
      <SignInForm {...args} />
    </AuthLayout>
  ),
  play: async ({ canvas }) => {
    // The label says what is happening; the fields keep their values.
    await expect(canvas.getByRole('button', { name: 'Signing in…' })).toBeDisabled();
    await expect(canvas.getByLabelText('Email')).toHaveValue('ada@acme.com');
  },
};

export const Success: SignInStory = {
  name: 'Sign in: success',
  args: { authenticate: fn(async () => {}) },
  render,
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    await userEvent.type(canvas.getByLabelText('Email'), 'ada@acme.com');
    await userEvent.type(canvas.getByLabelText('Password'), 'correct horse');
    await userEvent.click(canvas.getByRole('button', { name: 'Sign in' }));

    await waitFor(() =>
      expect(args.authenticate).toHaveBeenCalledWith({
        email: 'ada@acme.com',
        password: 'correct horse',
        remember: false,
      }),
    );
    // Toasts mount transparent and animate in.
    const title = await notifications(canvasElement).findByText('Signed in');
    await waitFor(() => expect(title).toBeVisible());
  },
};

export const Failure: SignInStory = {
  name: 'Sign in: failure',
  args: {
    authenticate: fn(async () => {
      throw new Error('Invalid credentials');
    }),
  },
  render,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const email = canvas.getByLabelText('Email');
    const password = canvas.getByLabelText('Password');
    await userEvent.type(email, 'ada@acme.com');
    await userEvent.type(password, 'wrong horse');
    await userEvent.click(canvas.getByRole('button', { name: 'Sign in' }));

    const toastRegion = notifications(canvasElement);
    const title = await toastRegion.findByText('Could not sign in');
    await waitFor(() => expect(title).toBeVisible());
    await expect(toastRegion.getByText('The email or password is incorrect.')).toBeVisible();

    // Both fields are invalid, without a message; focus returns to the first one.
    await waitFor(() => expect(email).toHaveFocus());
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(password).toHaveAttribute('aria-invalid', 'true');
    await expect(email).toHaveValue('ada@acme.com');
  },
};

export const CreateAccount: StoryObj<typeof CreateAccountForm> = {
  name: 'Create account',
  args: { onSubmit: fn() },
  render: (args) => (
    <AuthLayout>
      <CreateAccountForm {...args} />
    </AuthLayout>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const password = canvas.getByLabelText('Password');
    await expect(password).toHaveAttribute('autocomplete', 'new-password');
    await expect(password).toHaveAccessibleDescription('Use at least 8 characters.');

    await userEvent.type(canvas.getByLabelText('Name'), 'Ada Lovelace');
    await userEvent.type(canvas.getByLabelText('Email'), 'ada@acme.com');
    await userEvent.type(password, 'short');
    await userEvent.click(canvas.getByRole('button', { name: 'Create account' }));
    await waitFor(() => expect(password).toHaveFocus());
    await waitFor(() =>
      expect(password).toHaveAccessibleDescription(
        'Use at least 8 characters. Enter a password with at least 8 characters.',
      ),
    );

    await userEvent.type(password, ' horse');
    await userEvent.click(canvas.getByRole('button', { name: 'Create account' }));
    await waitFor(() =>
      expect(args.onSubmit).toHaveBeenCalledWith({
        name: 'Ada Lovelace',
        email: 'ada@acme.com',
        password: 'short horse',
      }),
    );
  },
};

export const ForgotPassword: StoryObj<typeof ForgotPasswordForm> = {
  name: 'Forgot password',
  args: { onSubmit: fn() },
  render: (args) => (
    <AuthLayout>
      <ForgotPasswordForm {...args} />
    </AuthLayout>
  ),
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText('Email'), 'ada@acme.com');
    await userEvent.click(canvas.getByRole('button', { name: 'Send reset link' }));
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledWith({ email: 'ada@acme.com' }));
  },
};

export const VerifyEmailScreen: StoryObj<typeof VerifyEmail> = {
  name: 'Verify email',
  args: { email: 'ada@acme.com', onResend: fn() },
  render: (args) => (
    <AuthLayout>
      <VerifyEmail {...args} />
    </AuthLayout>
  ),
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Resend email' }));
    await expect(args.onResend).toHaveBeenCalledOnce();
  },
};

export const Mobile: SignInStory = {
  name: 'Sign in: mobile',
  args: { authenticate: fn(async () => {}) },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  render,
  play: async ({ canvasElement }) => {
    // Below 1024px the image column is hidden and the <picture> falls back to the blank GIF,
    // so phones never download the picture.
    const image = canvasElement.querySelector('img');
    await expect(image).not.toBeVisible();
    await waitFor(() => expect(image?.currentSrc).toMatch(/^data:image\/gif/));
  },
};
