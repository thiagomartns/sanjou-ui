import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import { expect } from 'storybook/test';

import { Alert, AlertDescription, AlertTitle } from '@/registry/sanjou/ui/alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    docs: {
      description: {
        component: `A message that stays in the page, next to the content it is about. For short-lived feedback after an action, use Toast.

- \`neutral\`: general information.
- \`brand\`: tips and announcements.
- \`success\`, \`warning\` and \`danger\`: the result or the risk of something on the page.

Alert renders with \`role="alert"\`, so screen readers announce it as soon as it appears. Override \`role\` for messages that are part of the page from the start.`,
      },
    },
  },
  args: { variant: 'neutral' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'brand', 'success', 'warning', 'danger'],
    },
  },
  decorators: [(Story) => <div className="max-w-md">{Story()}</div>],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Alert {...args}>
      <Info />
      <AlertTitle>Scheduled maintenance</AlertTitle>
      <AlertDescription>
        The dashboard will be read-only on Sunday from 02:00 to 03:00 UTC.
      </AlertDescription>
    </Alert>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('Scheduled maintenance');
  },
};

export const Statuses: Story = {
  render: () => (
    <div className="grid gap-3">
      <Alert variant="brand" role="status">
        <Info />
        <AlertTitle>New editor available</AlertTitle>
        <AlertDescription>Turn it on in your workspace settings.</AlertDescription>
      </Alert>
      <Alert variant="success" role="status">
        <CircleCheck />
        <AlertTitle>Deploy finished</AlertTitle>
        <AlertDescription>Version 0.1.0 is live in production.</AlertDescription>
      </Alert>
      <Alert variant="warning" role="status">
        <TriangleAlert />
        <AlertTitle>Usage at 90%</AlertTitle>
        <AlertDescription>Upgrade your plan to avoid throttled requests.</AlertDescription>
      </Alert>
      <Alert variant="danger">
        <CircleAlert />
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>Update your card to keep the workspace active.</AlertDescription>
      </Alert>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('status')).toHaveLength(3);
    await expect(canvas.getByRole('alert')).toHaveTextContent('Payment failed');
  },
};

export const WithoutIcon: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Invites expire after 7 days</AlertTitle>
      <AlertDescription>Resend the invite if it has expired.</AlertDescription>
    </Alert>
  ),
};
