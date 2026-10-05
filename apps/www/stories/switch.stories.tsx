import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Label } from '@/registry/sanjou/ui/label';
import { Switch } from '@/registry/sanjou/ui/switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="notifications" />
      <Label htmlFor="notifications">Email notifications</Label>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole('switch', { name: 'Email notifications' });
    await expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
    await userEvent.keyboard('{Enter}');
    await expect(toggle).not.toBeChecked();
  },
};

export const Checked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="sso" defaultChecked />
      <Label htmlFor="sso">Require single sign-on</Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="audit-log" defaultChecked disabled />
      <Label htmlFor="audit-log">Audit log</Label>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('switch')).toBeDisabled();
  },
};
