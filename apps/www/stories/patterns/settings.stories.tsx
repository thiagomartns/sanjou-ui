import type { FormEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';

import { Button } from '@/registry/sanjou/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/registry/sanjou/ui/card';
import { Label } from '@/registry/sanjou/ui/label';
import { RadioGroup, RadioGroupItem } from '@/registry/sanjou/ui/radio-group';
import { Separator } from '@/registry/sanjou/ui/separator';
import { Switch } from '@/registry/sanjou/ui/switch';
import { Textarea } from '@/registry/sanjou/ui/textarea';

type Settings = { mentions: boolean; deploys: boolean; digest: string; signature: string };

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

type NotificationSettingsProps = { onSave: (settings: Settings) => void };

function NotificationSettings({ onSave }: NotificationSettingsProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSave({
      mentions: data.get('mentions') === 'on',
      deploys: data.get('deploys') === 'on',
      digest: String(data.get('digest')),
      signature: String(data.get('signature')),
    });
  }

  return (
    <Card className="w-md">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose what reaches your inbox.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
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
          <Separator />
          <div className="grid gap-1.5">
            <Label htmlFor="signature">Email signature</Label>
            <Textarea id="signature" name="signature" placeholder="Sent from Sanjou" />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="reset" variant="ghost">
            Discard changes
          </Button>
          <Button type="submit">Save changes</Button>
        </CardFooter>
      </form>
    </Card>
  );
}

const meta = {
  title: 'Patterns/Settings',
  component: NotificationSettings,
  parameters: { layout: 'centered' },
  args: { onSave: fn() },
} satisfies Meta<typeof NotificationSettings>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
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

    await userEvent.type(canvas.getByLabelText('Email signature'), 'Ada, platform team');
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
    await expect(args.onSave).toHaveBeenCalledWith({
      mentions: true,
      deploys: true,
      digest: 'never',
      signature: 'Ada, platform team',
    });
  },
};
