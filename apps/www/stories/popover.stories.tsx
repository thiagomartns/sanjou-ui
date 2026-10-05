import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';

import { Button } from '@/registry/sanjou/ui/button';
import { Input } from '@/registry/sanjou/ui/input';
import { Label } from '@/registry/sanjou/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/sanjou/ui/popover';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  parameters: {
    docs: {
      description: {
        component: `Floating content anchored to a trigger, such as a filter panel or a short form. It does not block the page, and it closes on Escape or a click outside. For a hint on hover, use Tooltip; for a task that must be finished or dismissed, use Dialog.`,
      },
    },
    layout: 'centered',
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

function DimensionsPopover(props: { defaultOpen?: boolean }) {
  return (
    <Popover {...props}>
      <PopoverTrigger asChild>
        <Button variant="outline">Edit dimensions</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Dimensions" className="grid gap-4">
        <div className="grid gap-1">
          <p className="text-sm font-medium">Dimensions</p>
          <p className="text-sm text-muted-foreground">Set the size of the layer.</p>
        </div>
        <div className="grid grid-cols-3 items-center gap-2">
          <Label htmlFor="popover-width">Width</Label>
          <Input id="popover-width" defaultValue="100%" className="col-span-2" />
          <Label htmlFor="popover-height">Height</Label>
          <Input id="popover-height" defaultValue="25px" className="col-span-2" />
        </div>
      </PopoverContent>
    </Popover>
  );
}

export const Default: Story = {
  render: () => <DimensionsPopover />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    // Content renders in a portal on document.body, outside the story canvas.
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Edit dimensions' });

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    const dialog = await body.findByRole('dialog', { name: 'Dimensions' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    // Focus moves to the first field on open.
    await waitFor(() => expect(body.getByLabelText('Width')).toHaveFocus());
    await expect(dialog).toBeVisible();
    await userEvent.tab();
    await expect(body.getByLabelText('Height')).toHaveFocus();

    // Escape closes and returns focus to the trigger.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();

    // Clicking outside closes too.
    await userEvent.click(trigger);
    await body.findByRole('dialog');
    await userEvent.click(canvasElement.ownerDocument.body);
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

export const Open: Story = {
  render: () => <DimensionsPopover defaultOpen />,
};
