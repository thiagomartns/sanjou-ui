import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plus } from 'lucide-react';
import { expect, fn } from 'storybook/test';

import { Button } from '@/registry/sanjou/ui/button';

const meta = {
  title: 'Components/Button',
  component: Button,
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

export const Primary: Story = {
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
  args: { disabled: true },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button');
    await expect(button).toBeDisabled();
    await userEvent.click(button, { pointerEventsCheck: 0 });
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
