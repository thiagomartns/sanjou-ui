import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plus } from 'lucide-react';
import { expect, fn } from 'storybook/test';

import { Button } from '@/registry/sanjou/ui/button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: `Triggers an action. Give each view one \`primary\` button for its main action; the other actions take quieter variants.

- \`primary\`: the main action. It is ink, not color.
- \`secondary\`: other actions next to the primary one.
- \`outline\`: actions that need a clear edge, such as Cancel in a dialog.
- \`ghost\`: toolbar and icon actions, where a fill would be noise.
- \`brand\`: rare brand moments, such as the call to action of an empty state.
- \`destructive\`: actions that delete or cannot be undone, usually after a confirmation.

\`md\` is the default size, with 14px text like fields. Use \`sm\` (13px text) in dense tables and toolbars, \`lg\` in standalone forms, and \`icon\` for icon-only buttons, which need an \`aria-label\`. With \`asChild\`, a link gets button styles and keeps link semantics.`,
      },
    },
  },
  args: { children: 'Create project', onClick: fn() },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'brand', 'destructive'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'icon'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Stories that assert on onClick get their own spy: the meta-level one is shared by every
// story in the file, and a click from one story can land in another's assertion on slow CI.
export const Primary: Story = {
  args: { onClick: fn() },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Create project' }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      <Button {...args}>Create project</Button>
      <Button {...args} variant="secondary">
        Duplicate
      </Button>
      <Button {...args} variant="outline">
        Export CSV
      </Button>
      <Button {...args} variant="ghost">
        Cancel
      </Button>
      <Button {...args} variant="brand">
        Upgrade plan
      </Button>
      <Button {...args} variant="destructive">
        Delete workspace
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
      <Button {...args} size="icon" aria-label="Add item">
        <Plus />
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, onClick: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button');
    await expect(button).toBeDisabled();
    // The play-context userEvent is already a setup() instance: options go through .setup().
    await userEvent.setup({ pointerEventsCheck: 0 }).click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const AsLink: Story = {
  args: { asChild: true, children: undefined },
  render: (args) => (
    <Button {...args}>
      <a href="#docs">Read the docs</a>
    </Button>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Read the docs' })).toHaveAttribute(
      'data-slot',
      'button',
    );
  },
};
