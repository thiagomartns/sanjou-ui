import type { Meta, StoryObj } from '@storybook/react-vite';
import { Copy } from 'lucide-react';
import { expect, waitFor, within } from 'storybook/test';

import { Button } from '@/registry/sanjou/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/registry/sanjou/ui/tooltip';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component: `A short hint shown on hover or focus, for icon-only buttons and truncated text. Keep it to a few words, and never put essential information or interactive content in it: touch screens cannot hover. It opens after 300ms and includes its own provider, so it works without app-level setup.`,
      },
    },
    layout: 'centered',
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Copy API key">
          <Copy />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Copy API key</TooltipContent>
    </Tooltip>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    // Content renders in a portal on document.body, outside the story canvas.
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Copy API key' });

    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await expect(await body.findByRole('tooltip')).toHaveTextContent('Copy API key');

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('tooltip')).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();

    await userEvent.hover(trigger);
    await expect(await body.findByRole('tooltip')).toBeInTheDocument();
    await userEvent.unhover(trigger);
  },
};

export const Open: Story = {
  render: () => (
    <Tooltip open>
      <TooltipTrigger asChild>
        <Button variant="outline">Deploy</Button>
      </TooltipTrigger>
      <TooltipContent side="right">Deploys the main branch to production</TooltipContent>
    </Tooltip>
  ),
};
