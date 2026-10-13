import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, within } from 'storybook/test';

import { Button } from '@/registry/sanjou/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/registry/sanjou/ui/dialog';
import { Input } from '@/registry/sanjou/ui/input';
import { Label } from '@/registry/sanjou/ui/label';

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    docs: {
      description: {
        component: `A modal window that blocks the page until it is closed. Use it for focused tasks and to confirm destructive actions. For light content next to a trigger that does not block the page, use Popover.

Always include \`DialogTitle\`, and \`DialogDescription\` when there is more to say. Focus moves into the dialog and returns to the trigger when it closes; Escape closes it. In a confirmation, name the action on the button ("Delete project"), not "OK".`,
      },
    },
    layout: 'centered',
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function EditProfileDialog(props: { defaultOpen?: boolean }) {
  return (
    <Dialog {...props}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Changes are visible to everyone in your workspace.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="dialog-name">Name</Label>
          <Input id="dialog-name" defaultValue="Ada Lovelace" />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const Default: Story = {
  render: () => <EditProfileDialog />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    // Content renders in a portal on document.body, outside the story canvas.
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Edit profile' });

    await userEvent.click(trigger);
    const dialog = await body.findByRole('dialog', { name: 'Edit profile' });
    await expect(dialog).toHaveAccessibleDescription(
      'Changes are visible to everyone in your workspace.',
    );

    // Focus starts on the first field and stays trapped inside.
    const name = body.getByLabelText('Name');
    await waitFor(() => expect(name).toHaveFocus());
    await userEvent.tab();
    await expect(body.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await userEvent.tab();
    await expect(body.getByRole('button', { name: 'Save changes' })).toHaveFocus();
    await userEvent.tab();
    await expect(body.getByRole('button', { name: 'Close' })).toHaveFocus();
    await userEvent.tab();
    await expect(name).toHaveFocus();

    // Escape closes and returns focus to the trigger.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();

    // The close button and DialogClose close it too.
    await userEvent.click(trigger);
    await userEvent.click(await body.findByRole('button', { name: 'Close' }));
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
    await userEvent.click(trigger);
    await userEvent.click(await body.findByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
};

export const Open: Story = {
  render: () => <EditProfileDialog defaultOpen />,
};

export const Confirmation: Story = {
  args: { onOpenChange: fn() },
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete project</Button>
      </DialogTrigger>
      <DialogContent role="alertdialog" showCloseButton={false} className="sm:max-w-md">
        <DialogHeader className="pr-0">
          <DialogTitle>Delete this project?</DialogTitle>
          <DialogDescription>
            This removes all deployments and environment variables. You cannot undo this.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive">Delete project</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.click(canvas.getByRole('button', { name: 'Delete project' }));
    const dialog = await body.findByRole('alertdialog', { name: 'Delete this project?' });
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);

    await userEvent.click(within(dialog).getByRole('button', { name: 'Delete project' }));
    await waitFor(() => expect(body.queryByRole('alertdialog')).not.toBeInTheDocument());
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
  },
};
