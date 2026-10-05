import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Checkbox } from '@/registry/sanjou/ui/checkbox';
import { Input } from '@/registry/sanjou/ui/input';
import { Label } from '@/registry/sanjou/ui/label';

const meta = {
  title: 'Components/Label',
  component: Label,
  parameters: {
    docs: {
      description: {
        component: `Names a form control. Point \`htmlFor\` at the control's \`id\`: screen readers announce the label with the control, and clicking the label focuses or toggles it.

- Inside a \`Form\`, use \`FormLabel\`: it wires the id for you.
- To name a group of controls, such as a radio group, use \`FieldLegend variant="label"\` inside a \`FieldSet\`.

Mark the few optional fields with the word "optional" rather than marking every required one. The label dims when the control before it has the \`peer\` class and is disabled.`,
      },
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="grid w-72 gap-1.5">
      <Label htmlFor="workspace">Workspace name</Label>
      <Input id="workspace" placeholder="Acme" />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText('Workspace name');
    await userEvent.click(canvas.getByText('Workspace name'));
    await expect(input).toHaveFocus();
  },
};

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="updates" />
      <Label htmlFor="updates">Send me product updates</Label>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole('checkbox', { name: 'Send me product updates' });
    await userEvent.click(canvas.getByText('Send me product updates'));
    await expect(checkbox).toBeChecked();
  },
};

export const Optional: Story = {
  render: () => (
    <div className="grid w-72 gap-1.5">
      <Label htmlFor="company">
        Company <span className="font-normal text-muted-foreground">(optional)</span>
      </Label>
      <Input id="company" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Company (optional)')).toBeInTheDocument();
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="legacy" disabled className="peer" />
      <Label htmlFor="legacy">Use the legacy editor</Label>
    </div>
  ),
};
