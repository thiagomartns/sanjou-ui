import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Checkbox } from '@/registry/sanjou/ui/checkbox';
import { Label } from '@/registry/sanjou/ui/label';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept the terms of service</Label>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole('checkbox', { name: 'Accept the terms of service' });
    await expect(checkbox).not.toBeChecked();
    await userEvent.click(canvas.getByText('Accept the terms of service'));
    await expect(checkbox).toBeChecked();
    await userEvent.keyboard(' ');
    await expect(checkbox).not.toBeChecked();
  },
};

export const Indeterminate: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="select-all" checked="indeterminate" />
      <Label htmlFor="select-all">Select all projects</Label>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
  },
};

export const Invalid: Story = {
  render: () => (
    <div className="grid gap-1.5">
      <div className="flex items-center gap-2">
        <Checkbox id="consent" aria-invalid aria-describedby="consent-error" />
        <Label htmlFor="consent">Share usage data</Label>
      </div>
      <p id="consent-error" className="text-sm text-danger-text">
        Confirm to continue.
      </p>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox')).toHaveAccessibleDescription('Confirm to continue.');
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="locked" defaultChecked disabled />
      <Label htmlFor="locked">Managed by your admin</Label>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox')).toBeDisabled();
  },
};
