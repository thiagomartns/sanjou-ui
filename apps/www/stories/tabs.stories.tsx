import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Button } from '@/registry/sanjou/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/registry/sanjou/ui/card';
import { Input } from '@/registry/sanjou/ui/input';
import { Label } from '@/registry/sanjou/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/sanjou/ui/tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component: `Switches between views of the same subject inside a page, such as Overview and Activity. Keep tabs few and their labels short. Do not use tabs for the steps of a sequence or to move between pages. Arrow keys move between tabs.`,
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-96">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="billing" disabled>
          Billing
        </TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-sm">
        Three deployments this week, all healthy.
      </TabsContent>
      <TabsContent value="activity" className="text-sm">
        No activity in the last 24 hours.
      </TabsContent>
      <TabsContent value="billing" className="text-sm">
        Billing is managed by your organization.
      </TabsContent>
      <TabsContent value="settings" className="text-sm">
        Project settings are read-only for viewers.
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvas, userEvent }) => {
    const overview = canvas.getByRole('tab', { name: 'Overview' });
    const activity = canvas.getByRole('tab', { name: 'Activity' });
    const settings = canvas.getByRole('tab', { name: 'Settings' });

    await expect(overview).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Three deployments');

    // Focus enters on the selected tab; arrows move and activate.
    await userEvent.tab();
    await expect(overview).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(activity).toHaveFocus();
    await expect(activity).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('No activity');

    // The disabled tab is skipped.
    await userEvent.keyboard('{ArrowRight}');
    await expect(settings).toHaveFocus();
    await expect(canvas.getByRole('tab', { name: 'Billing' })).toBeDisabled();

    await userEvent.keyboard('{Home}');
    await expect(overview).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(settings).toHaveAttribute('aria-selected', 'true');

    await userEvent.click(overview);
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Three deployments');
  },
};

export const WithCards: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-96">
      <TabsList className="w-full">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Change how your name appears to others.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Label htmlFor="tabs-name">Name</Label>
            <Input id="tabs-name" defaultValue="Ada Lovelace" />
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>You will be signed out of other sessions.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Label htmlFor="tabs-password">New password</Label>
            <Input id="tabs-password" type="password" />
          </CardContent>
          <CardFooter>
            <Button>Update password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};
