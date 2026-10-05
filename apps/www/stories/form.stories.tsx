import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm, useFormState, type Control, type Mode } from 'react-hook-form';
import { expect, fn, waitFor, within } from 'storybook/test';
import { z } from 'zod';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/sanjou/ui/select';

const schema = z.object({
  username: z
    .string()
    .min(3, 'Use at least 3 characters.')
    .regex(/^[a-z0-9-]*$/, 'Use only lowercase letters, numbers and hyphens.'),
  email: z.email('Enter a valid email address.'),
  role: z.enum(['admin', 'member', 'viewer'], { error: 'Choose a role.' }),
  terms: z.literal(true, { error: 'Accept the terms to continue.' }),
});

type Values = z.infer<typeof schema>;

function InviteForm({ onSubmit }: { onSubmit: (values: Values) => void }) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { username: '', email: '' },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid w-sm gap-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormDescription>Shown on comments and in mentions.</FormDescription>
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
                <Input type="email" autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              {/* An empty string keeps the Select controlled and shows the placeholder. */}
              <Select name={field.name} value={field.value ?? ''} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger ref={field.ref} onBlur={field.onBlur}>
                    <SelectValue placeholder="Choose a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    ref={field.ref}
                    name={field.name}
                    checked={field.value === true}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormLabel>Accept the terms of service</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="justify-self-start">
          Send invite
        </Button>
      </form>
    </Form>
  );
}

const meta = {
  title: 'Components/Form',
  component: InviteForm,
  // The Docs page is form.mdx.
  tags: ['!autodocs'],
} satisfies Meta<typeof InviteForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { onSubmit: fn() },
  play: async ({ args, canvas, userEvent }) => {
    // Only rendered parts are referenced: Email has no description and no error yet.
    await expect(canvas.getByLabelText('Email')).not.toHaveAttribute('aria-describedby');
    await expect(canvas.getByLabelText('Username')).toHaveAccessibleDescription(
      'Shown on comments and in mentions.',
    );

    await userEvent.type(canvas.getByLabelText('Username'), 'ada');
    await userEvent.type(canvas.getByLabelText('Email'), 'ada@sanjou.dev');
    await userEvent.click(canvas.getByRole('combobox', { name: 'Role' }));
    // Select content renders in a portal, outside the canvas.
    const body = within(canvas.getByLabelText('Username').ownerDocument.body);
    await userEvent.click(await body.findByRole('option', { name: 'Member' }));
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Accept the terms of service' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Send invite' }));

    await waitFor(() =>
      expect(args.onSubmit).toHaveBeenCalledWith(
        { username: 'ada', email: 'ada@sanjou.dev', role: 'member', terms: true },
        expect.anything(),
      ),
    );
  },
};

export const Errors: Story = {
  args: { onSubmit: fn() },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText('Username'), 'Ada Lovelace');
    await userEvent.click(canvas.getByRole('button', { name: 'Send invite' }));

    const username = canvas.getByLabelText('Username');
    // Focus moves before the messages render, so wait for both.
    await waitFor(() => expect(username).toHaveFocus());
    await waitFor(() =>
      expect(username).toHaveAccessibleDescription(
        'Shown on comments and in mentions. Use only lowercase letters, numbers and hyphens.',
      ),
    );
    await expect(username).toHaveAttribute('aria-invalid', 'true');
    const email = canvas.getByLabelText('Email');
    await expect(email).toHaveAccessibleDescription('Enter a valid email address.');
    // Email has no FormDescription, so it points at the message only.
    await expect(email.getAttribute('aria-describedby')?.split(' ')).toHaveLength(1);
    await expect(canvas.getByText('Choose a role.')).toBeVisible();
    await expect(canvas.getByText('Accept the terms to continue.')).toBeVisible();
    await expect(args.onSubmit).not.toHaveBeenCalled();

    // The message updates as the value is fixed.
    await userEvent.clear(username);
    await userEvent.type(username, 'ada');
    await waitFor(() => expect(username).toHaveAttribute('aria-invalid', 'false'));
  },
};

// Options: when to validate, when to enable submit, dirty and touched fields.
// An edit form, because dirty state only means something when there are saved values.

const profileSchema = z.object({
  name: z.string().min(2, 'Use at least 2 characters.'),
  email: z.email('Enter a valid email address.'),
});

type ProfileValues = z.infer<typeof profileSchema>;

const saved: ProfileValues = { name: 'Ada Lovelace', email: 'ada@sanjou.dev' };

/** Live `formState`, so each option's effect is visible. Documentation only, not UI. */
function FormStateDetails({ control }: { control: Control<ProfileValues> }) {
  const { isDirty, dirtyFields, touchedFields, isValid, isSubmitting } = useFormState({
    control,
  });
  const list = (fields: object) => Object.keys(fields).join(', ') || 'none';
  const rows = [
    ['isDirty', String(isDirty)],
    ['dirtyFields', list(dirtyFields)],
    ['touchedFields', list(touchedFields)],
    ['isValid', String(isValid)],
    ['isSubmitting', String(isSubmitting)],
  ];

  return (
    <section
      aria-label="Form state"
      className="grid w-56 content-start gap-2 rounded-lg border border-border bg-muted p-4"
    >
      <h3 className="text-xs font-medium text-muted-foreground">Form state</h3>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono text-xs">
        {rows.map(([name, value]) => (
          <div key={name} className="contents">
            <dt className="text-muted-foreground">{name}</dt>
            <dd data-testid={name}>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

type ProfileFormProps = {
  onSubmit: (values: ProfileValues) => void;
  /** When fields validate: react-hook-form's `mode`. */
  mode?: Mode;
  /** When the submit button is enabled. It is always disabled while submitting. */
  submitWhen?: 'always' | 'dirty' | 'valid';
  /** Simulated save time, in ms. */
  saveDelay?: number;
};

function ProfileForm({
  onSubmit,
  mode = 'onSubmit',
  submitWhen = 'always',
  saveDelay = 0,
}: ProfileFormProps) {
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: saved,
    mode,
  });
  const { isDirty, isValid, isSubmitting } = form.formState;
  const blocked = (submitWhen === 'dirty' && !isDirty) || (submitWhen === 'valid' && !isValid);

  async function save(values: ProfileValues) {
    await new Promise((resolve) => setTimeout(resolve, saveDelay));
    onSubmit(values);
    // The saved values become the new defaults, so the form is clean again.
    form.reset(values);
  }

  return (
    <div className="flex flex-wrap items-start gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(save)} noValidate className="grid w-xs gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input autoComplete="off" {...field} />
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
                  <Input type="email" autoComplete="off" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="justify-self-start" disabled={blocked || isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save changes'}
          </Button>
        </form>
      </Form>
      <FormStateDetails control={form.control} />
    </div>
  );
}

type ProfileStory = StoryObj<typeof ProfileForm>;

const profileStory = (args: Partial<ProfileFormProps>): ProfileStory => ({
  args: { onSubmit: fn(), ...args },
  render: (props) => <ProfileForm {...props} />,
});

export const ValidateOnSubmit: ProfileStory = {
  ...profileStory({ mode: 'onSubmit' }),
  play: async ({ canvas, userEvent }) => {
    const name = canvas.getByLabelText('Name');
    await userEvent.clear(name);
    await userEvent.tab();
    await expect(canvas.queryByText('Use at least 2 characters.')).toBeNull();

    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
    await expect(await canvas.findByText('Use at least 2 characters.')).toBeVisible();

    // After a submit, the field revalidates on every change (`reValidateMode: 'onChange'`).
    await userEvent.type(name, 'Ad');
    await waitFor(() => expect(canvas.queryByText('Use at least 2 characters.')).toBeNull());
  },
};

export const ValidateOnBlur: ProfileStory = {
  ...profileStory({ mode: 'onBlur' }),
  play: async ({ canvas, userEvent }) => {
    await userEvent.clear(canvas.getByLabelText('Name'));
    await expect(canvas.queryByText('Use at least 2 characters.')).toBeNull();
    await userEvent.tab();
    await expect(await canvas.findByText('Use at least 2 characters.')).toBeVisible();
  },
};

export const ValidateOnChange: ProfileStory = {
  ...profileStory({ mode: 'onChange' }),
  play: async ({ canvas, userEvent }) => {
    await userEvent.clear(canvas.getByLabelText('Name'));
    await expect(await canvas.findByText('Use at least 2 characters.')).toBeVisible();
  },
};

export const ValidateOnTouched: ProfileStory = {
  ...profileStory({ mode: 'onTouched' }),
  play: async ({ canvas, userEvent }) => {
    const name = canvas.getByLabelText('Name');
    await userEvent.clear(name);
    await expect(canvas.queryByText('Use at least 2 characters.')).toBeNull();
    await userEvent.tab();
    await expect(await canvas.findByText('Use at least 2 characters.')).toBeVisible();

    // Once touched, the field revalidates on every change, without another blur.
    await userEvent.type(name, 'Ad');
    await waitFor(() => expect(canvas.queryByText('Use at least 2 characters.')).toBeNull());
  },
};

export const SubmitWhenDirty: ProfileStory = {
  ...profileStory({ submitWhen: 'dirty' }),
  play: async ({ args, canvas, userEvent }) => {
    const submit = canvas.getByRole('button', { name: 'Save changes' });
    const name = canvas.getByLabelText('Name');
    await expect(submit).toBeDisabled();

    await userEvent.type(name, ' Byron');
    await waitFor(() => expect(submit).toBeEnabled());

    // Typing the saved value back makes the form clean again.
    await userEvent.clear(name);
    await userEvent.type(name, 'Ada Lovelace');
    await waitFor(() => expect(submit).toBeDisabled());

    await userEvent.type(name, ' Byron');
    await userEvent.click(submit);
    await waitFor(() =>
      expect(args.onSubmit).toHaveBeenCalledWith({ ...saved, name: 'Ada Lovelace Byron' }),
    );
    // After the save, the new values are the defaults: clean, so disabled.
    await waitFor(() => expect(canvas.getByTestId('isDirty')).toHaveTextContent('false'));
    await expect(canvas.getByRole('button', { name: 'Save changes' })).toBeDisabled();
  },
};

export const SubmitWhenValid: ProfileStory = {
  ...profileStory({ submitWhen: 'valid', mode: 'onChange' }),
  play: async ({ canvas, userEvent }) => {
    const submit = canvas.getByRole('button', { name: 'Save changes' });
    await waitFor(() => expect(submit).toBeEnabled());

    await userEvent.clear(canvas.getByLabelText('Email'));
    await waitFor(() => expect(submit).toBeDisabled());
    await userEvent.type(canvas.getByLabelText('Email'), 'ada@sanjou.dev');
    await waitFor(() => expect(submit).toBeEnabled());
  },
};

export const Submitting: ProfileStory = {
  ...profileStory({ saveDelay: 1000 }),
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));

    // Disabled while saving, so a second click cannot submit twice.
    const saving = await canvas.findByRole('button', { name: 'Saving…' });
    await expect(saving).toBeDisabled();
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledTimes(1), { timeout: 3000 });
    await expect(await canvas.findByRole('button', { name: 'Save changes' })).toBeEnabled();
  },
};

export const DirtyAndTouched: ProfileStory = {
  ...profileStory({}),
  play: async ({ canvas, userEvent }) => {
    // Focus and leave Email without changing it: touched, not dirty.
    await userEvent.click(canvas.getByLabelText('Email'));
    await userEvent.tab();
    await waitFor(() => expect(canvas.getByTestId('touchedFields')).toHaveTextContent('email'));
    await expect(canvas.getByTestId('dirtyFields')).toHaveTextContent('none');

    // Change Name: dirty while it differs from the saved value.
    await userEvent.type(canvas.getByLabelText('Name'), '!');
    await waitFor(() => expect(canvas.getByTestId('dirtyFields')).toHaveTextContent('name'));
    await expect(canvas.getByTestId('isDirty')).toHaveTextContent('true');
  },
};
