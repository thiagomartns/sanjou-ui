import type { Meta, StoryObj } from '@storybook/react-vite';
import { toast } from 'sonner';
import { expect, fn, waitFor, within } from 'storybook/test';

import { Button } from '@/registry/sanjou/ui/button';
import { Toaster } from '@/registry/sanjou/ui/sonner';

const meta = {
  title: 'Components/Toast',
  component: Toaster,
  parameters: { layout: 'centered' },
  // Sonner keeps toasts in a module-level store: clear it so one story's toasts never
  // show up in the next. The Docs page renders every story at once, so each story also has
  // its own <Toaster id> and fires with the matching toasterId.
  beforeEach: () => {
    toast.dismiss();
  },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

function ArchiveDemo({ onUndo }: { onUndo: () => void }) {
  return (
    <>
      <Button
        variant="outline"
        onClick={() =>
          toast('Project archived', {
            toasterId: 'default',
            description: 'It stays read-only until you restore it.',
            action: { label: 'Undo', onClick: onUndo },
          })
        }
      >
        Archive project
      </Button>
      <Toaster id="default" />
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

export const Types: Story = {
  render: () => (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => toast.success('Deploy finished', { toasterId: 'types' })}
        >
          Show success
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.info('A new version is available', { toasterId: 'types' })}
        >
          Show info
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.warning('Your trial ends in 3 days', { toasterId: 'types' })}
        >
          Show warning
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.error('Deploy failed', { toasterId: 'types' })}
        >
          Show error
        </Button>
      </div>
      <Toaster id="types" expand />
    </>
  ),
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
  },
};

export const RichColors: Story = {
  render: () => (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => toast.success('Deploy finished', { toasterId: 'rich-colors' })}
        >
          Show success
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.error('Deploy failed', {
              toasterId: 'rich-colors',
              description: 'The build step exited with code 1.',
            })
          }
        >
          Show error
        </Button>
      </div>
      <Toaster id="rich-colors" richColors expand />
    </>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Show success' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Show error' }));
    const description = await body.findByText('The build step exited with code 1.');
    await waitFor(() => expect(description).toBeVisible());
  },
};
