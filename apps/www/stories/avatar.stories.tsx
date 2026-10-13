import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Avatar, AvatarFallback, AvatarImage } from '@/registry/sanjou/ui/avatar';

// Inline images keep the stories offline and deterministic.
const photo = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8da4ef"/><stop offset="1" stop-color="#3e63dd"/></linearGradient></defs><rect width="64" height="64" fill="url(#g)"/><circle cx="32" cy="26" r="11" fill="#e0e7ff"/><path d="M12 60c2-12 10-18 20-18s18 6 20 18z" fill="#e0e7ff"/></svg>',
)}`;
const broken = 'data:image/png;base64,AAAA';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component: `Identifies a person next to their name: the user menu trigger, table cells, comments. Do not use it as the only label: show the name too, or give the trigger an accessible name.

- \`sm\` (24px): dense rows and menus.
- \`md\` (32px, default): headers and lists.
- \`lg\` (40px): profile cards.

\`AvatarFallback\` shows the initials until \`AvatarImage\` loads, and stays when the image fails. Always pass \`alt\` to the image.`,
      },
    },
  },
  args: { size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src={photo} alt="Olivia Martin" />
      <AvatarFallback>OM</AvatarFallback>
    </Avatar>
  ),
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('img', { name: 'Olivia Martin' })).toBeVisible();
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="grid gap-4">
      <div className="flex items-center gap-3">
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <Avatar key={size} size={size}>
            <AvatarImage src={photo} alt={`Olivia Martin, ${size}`} />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
        ))}
      </div>
      <div className="flex items-center gap-3">
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <Avatar key={size} size={size}>
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
        ))}
      </div>
    </div>
  ),
};

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src={broken} alt="Jackson Lee" />
      <AvatarFallback>JL</AvatarFallback>
    </Avatar>
  ),
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('JL')).toBeVisible();
    await expect(canvas.queryByRole('img')).toBeNull();
  },
};

export const WithName: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarFallback>OM</AvatarFallback>
      </Avatar>
      <div className="grid">
        <span className="text-sm font-medium">Olivia Martin</span>
        <span className="text-sm text-muted-foreground">olivia@acme.com</span>
      </div>
    </div>
  ),
};
