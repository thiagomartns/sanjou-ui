import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { FieldLegend, FieldSet } from '@/registry/sanjou/ui/field';
import { Input } from '@/registry/sanjou/ui/input';
import { Label } from '@/registry/sanjou/ui/label';
import { RadioGroup, RadioGroupItem } from '@/registry/sanjou/ui/radio-group';

const meta = {
  title: 'Components/FieldSet',
  component: FieldSet,
  parameters: {
    docs: {
      description: {
        component: `Groups related fields under a heading, with a native \`fieldset\` and \`legend\`. Screen readers announce the legend as the name of the group when focus enters it.

- \`FieldLegend\` (default \`variant="legend"\`): heads a section of fields, such as a billing address.
- \`variant="label"\`: names one choice made of several controls, such as a radio group. It matches Label, so it lines up with the other fields in a form.

Set \`disabled\` on the FieldSet to disable every control inside it at once.`,
      },
    },
  },
} satisfies Meta<typeof FieldSet>;

export default meta;
type Story = StoryObj<typeof meta>;

const frequencies = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'never', label: 'Never' },
];

export const RadioGroupLabel: Story = {
  render: (args) => (
    <FieldSet {...args}>
      <FieldLegend variant="label">Activity digest</FieldLegend>
      <RadioGroup name="digest" defaultValue="weekly" className="flex gap-6">
        {frequencies.map((frequency) => (
          <div key={frequency.value} className="flex items-center gap-2">
            <RadioGroupItem id={`digest-${frequency.value}`} value={frequency.value} />
            <Label htmlFor={`digest-${frequency.value}`}>{frequency.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </FieldSet>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('group', { name: 'Activity digest' })).toBeInTheDocument();
  },
};

export const Section: Story = {
  render: (args) => (
    <FieldSet className="max-w-sm" {...args}>
      <FieldLegend>Billing address</FieldLegend>
      <div className="grid gap-1.5">
        <Label htmlFor="street">Street</Label>
        <Input id="street" autoComplete="street-address" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="city">City</Label>
          <Input id="city" autoComplete="address-level2" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="postal-code">Postal code</Label>
          <Input id="postal-code" autoComplete="postal-code" />
        </div>
      </div>
    </FieldSet>
  ),
  play: async ({ canvas }) => {
    const group = canvas.getByRole('group', { name: 'Billing address' });
    await expect(group).toContainElement(canvas.getByLabelText('City'));
  },
};

export const Disabled: Story = {
  ...Section,
  args: { disabled: true },
  play: async ({ canvas }) => {
    for (const name of ['Street', 'City', 'Postal code']) {
      await expect(canvas.getByLabelText(name)).toBeDisabled();
    }
  },
};
