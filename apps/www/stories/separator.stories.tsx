import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Separator } from '@/registry/sanjou/ui/separator';

const meta = {
  title: 'Components/Separator',
  component: Separator,
  parameters: {
    docs: {
      description: {
        component: `A thin line that divides content. It is decorative by default and hidden from assistive tech. Set \`decorative={false}\` when the line marks a real boundary between sections, so screen readers announce it. Use \`orientation="vertical"\` inside rows, such as toolbars.`,
      },
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="grid max-w-sm gap-3 text-sm">
      <div className="grid gap-1">
        <p className="font-medium">Sanjou UI</p>
        <p className="text-muted-foreground">Tokens and components for product teams.</p>
      </div>
      <Separator />
      <p className="text-muted-foreground">Version 0.1.0</p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const separator = canvasElement.querySelector('[data-slot="separator"]');
    await expect(separator).toHaveAttribute('role', 'none');
  },
};

export const Vertical: Story = {
  render: () => (
    <nav aria-label="Footer" className="flex h-5 items-center gap-3 text-sm">
      <a href="#docs">Docs</a>
      <Separator orientation="vertical" />
      <a href="#changelog">Changelog</a>
      <Separator orientation="vertical" />
      <a href="#github">GitHub</a>
    </nav>
  ),
};

export const Semantic: Story = {
  render: () => (
    <div className="flex h-12 items-center gap-4 text-sm">
      <span>Account</span>
      <Separator orientation="vertical" decorative={false} />
      <span>Billing</span>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  },
};
