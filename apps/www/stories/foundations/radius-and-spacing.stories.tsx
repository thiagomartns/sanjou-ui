import type { Meta, StoryObj } from '@storybook/react-vite';
import tokens from '@sanjou/tokens/tokens.json';

const meta = {
  title: 'Foundations/Radius and spacing',
  // The Docs page is radius-and-spacing.mdx.
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Class names must be static strings so Tailwind can find them.
const radii = [
  ['sm', 'rounded-sm'],
  ['md', 'rounded-md'],
  ['lg', 'rounded-lg'],
  ['xl', 'rounded-xl'],
  ['full', 'rounded-full'],
] as const;

export const Radius: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6 p-6">
      {radii.map(([name, className]) => (
        <div key={name} className="grid justify-items-center gap-2">
          <div className={`size-16 border border-border bg-muted ${className}`} />
          <span className="font-mono text-xs">{name}</span>
          <span className="font-mono text-xs text-muted-foreground">
            {name === 'full' ? 'pill' : `${tokens.radius[name].$value.value}px`}
          </span>
        </div>
      ))}
    </div>
  ),
};

// `0_5` in tokens.json is Tailwind's `0.5`.
const space = Object.entries(tokens.space)
  .map(([step, token]) => [step.replace('_', '.'), token.$value.value] as const)
  .sort((a, b) => a[1] - b[1]);

export const Spacing: Story = {
  render: () => (
    <div className="grid gap-2 p-6">
      {space.map(([step, px]) => (
        <div key={step} className="grid grid-cols-[48px_48px_1fr] items-center gap-4">
          <span className="font-mono text-xs">{step}</span>
          <span className="font-mono text-xs text-muted-foreground">{px}px</span>
          <div className="h-3 rounded-sm bg-brand" style={{ width: px }} />
        </div>
      ))}
    </div>
  ),
};

// Class names must be static strings so Tailwind can find them.
const shadows = [
  ['xs', 'shadow-xs', 'Controls: buttons, fields, switches'],
  ['md', 'shadow-md', 'Floating: popovers, menus, tooltips, toasts'],
  ['lg', 'shadow-lg', 'Dialogs'],
] as const;

export const Elevation: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 p-6">
      {shadows.map(([name, className, use]) => (
        <div key={name} className="grid w-48 content-start gap-2">
          <div className={`h-20 rounded-lg border border-border bg-background ${className}`} />
          <span className="font-mono text-xs">{name}</span>
          <span className="text-xs text-muted-foreground">{use}</span>
        </div>
      ))}
    </div>
  ),
};
