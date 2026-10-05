import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { LogOut, MoreHorizontal, Settings, Trash2, User } from 'lucide-react';
import { expect, fn, waitFor, within } from 'storybook/test';

import { Button } from '@/registry/sanjou/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/registry/sanjou/ui/dropdown-menu';

const meta = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    docs: {
      description: {
        component: `A list of actions or options opened from a button, such as a row's actions or an account menu. To choose a value in a form, use Select.

Group items with labels and separators, and use checkbox or radio items for view options. Items with \`variant="destructive"\` delete things; keep them last. Arrow keys move between items, and typing jumps to a matching item.`,
      },
    },
    layout: 'centered',
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const onProfile = fn();

// Stories rendered open use modal={false}: in modal mode Radix sets aria-hidden on the
// rest of the page while the trigger stays focusable, which axe flags (aria-hidden-focus)
// even though focus is trapped in the menu. Default keeps the modal behavior.
function AccountMenu(props: { defaultOpen?: boolean }) {
  return (
    <DropdownMenu modal={!props.defaultOpen} {...props}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={onProfile}>
            <User />
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings />
            Settings
            <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>Billing</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Email</DropdownMenuItem>
            <DropdownMenuItem>Copy link</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const Default: Story = {
  render: () => <AccountMenu />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    // Content renders in a portal on document.body, outside the story canvas.
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Open menu' });

    // Enter opens and focuses the first item.
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    const menu = await body.findByRole('menu');
    const profile = within(menu).getByRole('menuitem', { name: /Profile/ });
    await waitFor(() => expect(profile).toHaveFocus());

    // Arrows move between items, skipping the disabled one.
    await userEvent.keyboard('{ArrowDown}');
    await expect(within(menu).getByRole('menuitem', { name: /Settings/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    const invite = within(menu).getByRole('menuitem', { name: 'Invite users' });
    await expect(invite).toHaveFocus();

    // ArrowRight opens the submenu, ArrowLeft returns to its trigger.
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(body.getByRole('menuitem', { name: 'Email' })).toHaveFocus());
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => expect(invite).toHaveFocus());

    // Escape closes and returns focus to the trigger.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();

    // Selecting an item calls onSelect and closes the menu.
    onProfile.mockClear();
    await userEvent.click(trigger);
    await userEvent.click(await body.findByRole('menuitem', { name: /Profile/ }));
    await expect(onProfile).toHaveBeenCalledOnce();
    await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument());
  },
};

export const Open: Story = {
  render: () => <AccountMenu defaultOpen />,
};

function ViewMenu() {
  const [statusBar, setStatusBar] = useState(true);
  const [panel, setPanel] = useState(false);
  const [position, setPosition] = useState('bottom');

  return (
    <DropdownMenu modal={false} defaultOpen>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">View</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked={statusBar} onCheckedChange={setStatusBar}>
          Status bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={panel} onCheckedChange={setPanel}>
          Activity panel
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Panel position</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const CheckboxAndRadio: Story = {
  render: () => <ViewMenu />,
  play: async ({ canvasElement, userEvent }) => {
    const body = within(canvasElement.ownerDocument.body);
    const statusBar = await body.findByRole('menuitemcheckbox', { name: 'Status bar' });
    await expect(statusBar).toHaveAttribute('aria-checked', 'true');
    await expect(body.getByRole('menuitemradio', { name: 'Bottom' })).toHaveAttribute(
      'aria-checked',
      'true',
    );

    await userEvent.click(statusBar);
    await userEvent.click(await body.findByRole('button', { name: 'View' }));
    await expect(await body.findByRole('menuitemcheckbox', { name: 'Status bar' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  },
};

export const Destructive: Story = {
  render: () => (
    <DropdownMenu modal={false} defaultOpen>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Project actions">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Rename</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2 />
          Delete project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
