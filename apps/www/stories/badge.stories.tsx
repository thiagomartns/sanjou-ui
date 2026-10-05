import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '@/registry/sanjou/ui/badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    docs: {
      description: {
        component: `A short label for status or metadata, such as a plan, a state or a count. Badges are not interactive: for an action, use Button.

- \`neutral\`: metadata with no meaning attached.
- \`outline\`: the quietest option, for dense lists.
- \`brand\`: new or highlighted features.
- \`success\`, \`warning\` and \`danger\`: states.

Set \`dot\` to add a leading status dot.`,
      },
    },
  },
  args: { children: 'Beta', variant: 'brand' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'outline', 'brand', 'success', 'warning', 'danger'],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Statuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Draft</Badge>
      <Badge variant="outline">v0.1.0</Badge>
      <Badge variant="brand">Beta</Badge>
      <Badge variant="success" dot>
        Operational
      </Badge>
      <Badge variant="warning" dot>
        Degraded
      </Badge>
      <Badge variant="danger" dot>
        Failed
      </Badge>
    </div>
  ),
};
