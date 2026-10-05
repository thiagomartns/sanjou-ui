import { useState, type FormEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, within } from 'storybook/test';

import { Button } from '@/registry/sanjou/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/registry/sanjou/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/registry/sanjou/ui/dialog';
import { Label } from '@/registry/sanjou/ui/label';
import { RadioGroup, RadioGroupItem } from '@/registry/sanjou/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/sanjou/ui/select';
import { Separator } from '@/registry/sanjou/ui/separator';
import { Switch } from '@/registry/sanjou/ui/switch';
import { Textarea } from '@/registry/sanjou/ui/textarea';

type Settings = {
  mentions: boolean;
  deploys: boolean;
  digest: string;
  timezone: string;
  signature: string;
};

const toggles = [
  {
    name: 'mentions',
    label: 'Mentions',
    description: 'When someone mentions you in a comment.',
    defaultChecked: true,
  },
  {
    name: 'deploys',
    label: 'Deploy status',
    description: 'When a deploy you started finishes or fails.',
    defaultChecked: false,
  },
] as const;

const frequencies = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'never', label: 'Never' },
];

const timezones = [
  { value: 'utc', label: 'UTC' },
  { value: 'brt', label: 'Brasília (BRT)' },
  { value: 'cet', label: 'Berlin (CET)' },
  { value: 'jst', label: 'Tokyo (JST)' },
];

type NotificationSettingsProps = { onSave: (settings: Settings) => void };

function NotificationSettings({ onSave }: NotificationSettingsProps) {
  // Discarding remounts the fields so every control, Radix ones included, returns to its
  // default. The footer stays mounted, so the dialog can hand focus back to its trigger.
  const [fieldsKey, setFieldsKey] = useState(0);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSave({
      mentions: data.get('mentions') === 'on',
      deploys: data.get('deploys') === 'on',
      digest: String(data.get('digest')),
      timezone: String(data.get('timezone')),
      signature: String(data.get('signature')),
    });
  }

  return (
    <Card className="w-md">
      <form aria-label="Notification settings" onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose what reaches your inbox.</CardDescription>
        </CardHeader>
        <CardContent key={fieldsKey} className="grid gap-5">
          <div className="grid gap-4">
            {toggles.map((toggle) => (
              <div key={toggle.name} className="flex items-start justify-between gap-4">
                <div className="grid gap-0.5">
                  <Label htmlFor={toggle.name}>{toggle.label}</Label>
                  <p id={`${toggle.name}-description`} className="text-sm text-muted-foreground">
                    {toggle.description}
                  </p>
                </div>
                <Switch
                  id={toggle.name}
                  name={toggle.name}
                  defaultChecked={toggle.defaultChecked}
                  aria-describedby={`${toggle.name}-description`}
                />
              </div>
            ))}
          </div>
          <Separator />
          <fieldset className="grid gap-3">
            <legend className="mb-3 text-sm leading-5 font-medium">Activity digest</legend>
            <RadioGroup name="digest" defaultValue="weekly" className="flex gap-6">
              {frequencies.map((frequency) => (
                <div key={frequency.value} className="flex items-center gap-2">
                  <RadioGroupItem id={`digest-${frequency.value}`} value={frequency.value} />
                  <Label htmlFor={`digest-${frequency.value}`}>{frequency.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </fieldset>
          <div className="grid gap-1.5">
            <Label htmlFor="timezone">Digest time zone</Label>
            <Select name="timezone" defaultValue="utc">
              <SelectTrigger id="timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((timezone) => (
                  <SelectItem key={timezone.value} value={timezone.value}>
                    {timezone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="grid gap-1.5">
            <Label htmlFor="signature">Email signature</Label>
            <Textarea id="signature" name="signature" placeholder="Sent from Sanjou" />
          </div>
        </CardContent>
        <CardFooter>
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" variant="ghost">
                Discard changes
              </Button>
            </DialogTrigger>
            <DialogContent role="alertdialog" showCloseButton={false} className="sm:max-w-md">
              <DialogHeader className="pr-0">
                <DialogTitle>Discard unsaved changes?</DialogTitle>
                <DialogDescription>
                  Your notification settings go back to how they were when you opened this page.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Keep editing</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="destructive" onClick={() => setFieldsKey((key) => key + 1)}>
                    Discard changes
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button type="submit">Save changes</Button>
        </CardFooter>
      </form>
    </Card>
  );
}

const meta = {
  title: 'Patterns/Settings',
  component: NotificationSettings,
  parameters: {
    docs: {
      description: {
        component: `A settings form in a Card: switches for notifications, a radio group and a select for the activity digest, a textarea for the email signature, and Save in the footer. Discarding unsaved changes asks for confirmation in a Dialog.`,
      },
    },
    layout: 'centered',
  },
  args: { onSave: fn() },
} satisfies Meta<typeof NotificationSettings>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const deploys = canvas.getByRole('switch', { name: 'Deploy status' });
    await expect(deploys).toHaveAccessibleDescription(
      'When a deploy you started finishes or fails.',
    );
    await userEvent.click(deploys);
    await expect(deploys).toBeChecked();

    const weekly = canvas.getByRole('radio', { name: 'Weekly' });
    await userEvent.click(weekly);
    // Radix selects only while the arrow key is held down (see Components/RadioGroup).
    const never = canvas.getByRole('radio', { name: 'Never' });
    await userEvent.keyboard('{ArrowRight>}');
    await waitFor(() => expect(never).toBeChecked());
    await userEvent.keyboard('{/ArrowRight}');

    // Select renders its options in a portal on document.body.
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('combobox', { name: 'Digest time zone' }));
    await userEvent.click(await body.findByRole('option', { name: 'Brasília (BRT)' }));
    await expect(canvas.getByRole('combobox', { name: 'Digest time zone' })).toHaveTextContent(
      'Brasília (BRT)',
    );

    await userEvent.type(canvas.getByLabelText('Email signature'), 'Ada, platform team');
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
    await expect(args.onSave).toHaveBeenCalledWith({
      mentions: true,
      deploys: true,
      digest: 'never',
      timezone: 'brt',
      signature: 'Ada, platform team',
    });
  },
};

export const DiscardChanges: Story = {
  args: { onSave: fn() },
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const body = within(canvasElement.ownerDocument.body);
    const discard = canvas.getByRole('button', { name: 'Discard changes' });

    await userEvent.click(canvas.getByRole('switch', { name: 'Deploy status' }));
    await expect(canvas.getByRole('switch', { name: 'Deploy status' })).toBeChecked();

    // Keep editing: the dialog closes and the change stays.
    await userEvent.click(discard);
    const dialog = await body.findByRole('alertdialog', { name: 'Discard unsaved changes?' });
    await userEvent.click(within(dialog).getByRole('button', { name: 'Keep editing' }));
    await waitFor(() => expect(body.queryByRole('alertdialog')).not.toBeInTheDocument());
    await expect(discard).toHaveFocus();
    await expect(canvas.getByRole('switch', { name: 'Deploy status' })).toBeChecked();

    // Discard: every field goes back to its default and focus returns to the trigger.
    await userEvent.click(discard);
    await userEvent.click(
      within(await body.findByRole('alertdialog')).getByRole('button', {
        name: 'Discard changes',
      }),
    );
    await waitFor(() => expect(body.queryByRole('alertdialog')).not.toBeInTheDocument());
    await expect(canvas.getByRole('switch', { name: 'Deploy status' })).not.toBeChecked();
    await expect(discard).toHaveFocus();
    await expect(args.onSave).not.toHaveBeenCalled();
  },
};
