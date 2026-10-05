import { useId } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { toast } from 'sonner';
import { expect, fn, waitFor, within } from 'storybook/test';

import { Button } from '@/registry/sanjou/ui/button';
import { Toaster } from '@/registry/sanjou/ui/sonner';

// The toaster is position: fixed, so on the Docs page toasts would land in the corner of the
// whole page. A transformed ancestor becomes the containing block of fixed descendants: the
// frame keeps each example's toasts in its own bottom corner. It has to span the full width
// of the Docs block, so the stories use the padded layout and center the demo here.
const withToastFrame: Decorator = (Story, context) => {
  if (context.viewMode !== 'docs') {
    return (
      <div className="flex min-h-[calc(100dvh-2rem)] items-center justify-center">
        <Story />
      </div>
    );
  }
  const height = (context.parameters.toastFrame as { height?: number } | undefined)?.height;
  return (
    <div
      className="relative flex w-full items-center justify-center overflow-hidden"
      style={{ height: height ?? 320, transform: 'translateZ(0)' }}
    >
      <Story />
    </div>
  );
};

const meta = {
  title: 'Components/Toast',
  component: Toaster,
  parameters: { layout: 'padded' },
  decorators: [withToastFrame],
  // Sonner keeps toasts in a module-level store. Every demo passes its own useId() as the
  // Toaster id and toasterId, so examples rendered together (the Docs page shows the first
  // story twice) never share toasts. Vitest runs the stories in one document: start empty.
  beforeEach: () => {
    toast.dismiss();
  },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Waits for every toast to leave, so a story never opens with toasts already on screen. */
async function dismissAll(body: ReturnType<typeof within>) {
  toast.dismiss();
  await waitFor(() => expect(body.queryAllByRole('listitem')).toHaveLength(0));
}

function ArchiveDemo({ onUndo }: { onUndo: () => void }) {
  const toasterId = useId();
  return (
    <>
      <Button
        variant="outline"
        onClick={() =>
          toast('Project archived', {
            toasterId,
            description: 'It stays read-only until you restore it.',
            action: { label: 'Undo', onClick: onUndo },
          })
        }
      >
        Archive project
      </Button>
      <Toaster id={toasterId} />
    </>
  );
}

export const Default: StoryObj<typeof ArchiveDemo> = {
  args: { onUndo: fn() },
  render: (args) => <ArchiveDemo {...args} />,
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const body = within(canvasElement.ownerDocument.body);

    // The toaster is a labelled live region, so screen readers announce new toasts.
    const region = body.getByRole('region', { name: /Notifications/ });
    await userEvent.click(canvas.getByRole('button', { name: 'Archive project' }));
    // Toasts mount transparent and animate in.
    const title = await within(region).findByText('Project archived');
    await waitFor(() => expect(title).toBeVisible());
    await expect(
      within(region).getByText('It stays read-only until you restore it.'),
    ).toBeVisible();

    // The action runs its callback and dismisses the toast.
    await userEvent.click(within(region).getByRole('button', { name: 'Undo' }));
    await expect(args.onUndo).toHaveBeenCalledOnce();
    await waitFor(() =>
      expect(within(region).queryByText('Project archived')).not.toBeInTheDocument(),
    );
  },
};

function TypesDemo() {
  const toasterId = useId();
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => toast.success('Deploy finished', { toasterId })}>
          Show success
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.info('A new version is available', { toasterId })}
        >
          Show info
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.warning('Your trial ends in 3 days', { toasterId })}
        >
          Show warning
        </Button>
        <Button variant="outline" onClick={() => toast.error('Deploy failed', { toasterId })}>
          Show error
        </Button>
      </div>
      <Toaster id={toasterId} expand />
    </>
  );
}

export const Types: Story = {
  // Expanded stacks need room above the toasts so they do not cover the buttons.
  parameters: { toastFrame: { height: 440 } },
  render: () => <TypesDemo />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const body = within(canvasElement.ownerDocument.body);
    const cases = [
      ['Show success', 'Deploy finished'],
      ['Show info', 'A new version is available'],
      ['Show warning', 'Your trial ends in 3 days'],
      ['Show error', 'Deploy failed'],
    ] as const;
    for (const [button, message] of cases) {
      await userEvent.click(canvas.getByRole('button', { name: button }));
      await expect(await body.findByText(message)).toBeInTheDocument();
    }
    await dismissAll(body);
  },
};

function RichColorsDemo() {
  const toasterId = useId();
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => toast.success('Deploy finished', { toasterId })}>
          Show success
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.error('Deploy failed', {
              toasterId,
              description: 'The build step exited with code 1.',
            })
          }
        >
          Show error
        </Button>
      </div>
      <Toaster id={toasterId} richColors expand />
    </>
  );
}

export const RichColors: Story = {
  parameters: { toastFrame: { height: 440 } },
  render: () => <RichColorsDemo />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Show success' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Show error' }));
    const description = await body.findByText('The build step exited with code 1.');
    await waitFor(() => expect(description).toBeVisible());
    await dismissAll(body);
  },
};

function AllToastsDemo() {
  const toasterId = useId();
  function showAll() {
    for (const richColors of [false, true]) {
      toast.success('Deploy finished', { toasterId, richColors });
      toast.info('A new version is available', { toasterId, richColors });
      toast.warning('Your trial ends in 3 days', { toasterId, richColors });
      toast.error('Deploy failed', {
        toasterId,
        richColors,
        description: 'The build step exited with code 1.',
      });
    }
  }
  return (
    <>
      <Button variant="outline" onClick={showAll}>
        Show all toasts
      </Button>
      <Toaster id={toasterId} expand visibleToasts={8} />
    </>
  );
}

/**
 * Test only (hidden from the sidebar and Docs): leaves every type open, plain and rich,
 * so axe checks their colors in both themes. The visible stories close their toasts.
 */
export const OpenToastsA11y: Story = {
  tags: ['!dev', '!autodocs'],
  render: () => <AllToastsDemo />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Show all toasts' }));
    await waitFor(() => expect(body.getAllByRole('listitem')).toHaveLength(8));
    for (const item of body.getAllByRole('listitem')) {
      await waitFor(() => expect(item).toBeVisible());
    }
  },
};
