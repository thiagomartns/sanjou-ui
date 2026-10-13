import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Input } from '@/registry/sanjou/ui/input';
import { Label } from '@/registry/sanjou/ui/label';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component: `A single-line text field. Pair it with a \`Label\`, and set \`type\` (email, password, number, search) so the right keyboard and autofill appear. Set \`aria-invalid\` to show an error and link the message with \`aria-describedby\`. For longer text, use Textarea.`,
      },
    },
  },
  decorators: [(Story) => <div className="grid max-w-sm gap-1.5">{Story()}</div>],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <>
      <Label htmlFor="workspace">Workspace name</Label>
      <Input id="workspace" placeholder="acme-production" />
    </>
  ),
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText('Workspace name');
    await userEvent.type(input, 'sanjou');
    await expect(input).toHaveValue('sanjou');
  },
};

export const Invalid: Story = {
  render: () => (
    <>
      <Label htmlFor="slug">Slug</Label>
      <Input id="slug" defaultValue="Acme Production" aria-invalid aria-describedby="slug-error" />
      <p id="slug-error" className="text-sm text-danger-text">
        Use only lowercase letters, numbers and hyphens.
      </p>
    </>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Slug')).toHaveAccessibleDescription(
      'Use only lowercase letters, numbers and hyphens.',
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <>
      <Label htmlFor="project-id">Project ID</Label>
      <Input id="project-id" className="font-mono" defaultValue="prj_8f3a2c91" disabled />
    </>
  ),
};
