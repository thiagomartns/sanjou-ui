import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Skeleton } from '@/registry/sanjou/ui/skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div aria-busy="true" className="flex max-w-sm items-center gap-3">
      <span className="sr-only">Loading profile</span>
      <Skeleton className="size-10 rounded-full" />
      <div className="grid flex-1 gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    // Assistive tech hears the status text, not the placeholder shapes.
    await expect(canvas.getByText('Loading profile')).toBeInTheDocument();
    for (const skeleton of canvasElement.querySelectorAll('[data-slot="skeleton"]')) {
      await expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    }
  },
};

export const Card: Story = {
  render: () => (
    <div
      aria-busy="true"
      className="grid max-w-sm gap-3 rounded-lg border border-border bg-card p-6"
    >
      <span className="sr-only">Loading project</span>
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="mt-2 h-8 w-28" />
    </div>
  ),
};
