import type { Meta, StoryObj } from '@storybook/react-vite';
import tokens from '@sanjou/tokens/tokens.json';

const scales = Object.keys(tokens.light.scale);
const semantic = Object.keys(tokens.light).filter((k) => k !== 'scale');
const steps = Array.from({ length: 12 }, (_, i) => i + 1);

const meta = {
  title: 'Foundations/Color',
  // Swatch captions sit on arbitrary colors by design; they are documentation, not UI.
  parameters: { a11y: { test: 'todo' }, layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scales: Story = {
  render: () => (
    <div className="grid gap-4 p-6">
      {scales.map((scale) => (
        <div
          key={scale}
          className="grid grid-cols-[80px_repeat(12,minmax(0,1fr))] items-center gap-1"
        >
          <span className="text-sm font-medium">{scale}</span>
          {steps.map((step) => (
            <div key={step} className="grid gap-1">
              <div
                className="h-10 rounded-sm border border-border"
                style={{ background: `var(--${scale}-${step})` }}
              />
              <span className="text-center font-mono text-xs text-muted-foreground">{step}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Semantic: Story = {
  render: () => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3 p-6">
      {semantic.map((name) => (
        <div key={name} className="grid gap-1.5">
          <div
            className="h-12 rounded-md border border-border"
            style={{ background: `var(--${name})` }}
          />
          <span className="font-mono text-xs">{name}</span>
        </div>
      ))}
    </div>
  ),
};

// Class names must be static strings so Tailwind can find them.
const typeScale = [
  ['5xl', 'text-5xl font-semibold'],
  ['4xl', 'text-4xl font-semibold'],
  ['3xl', 'text-3xl font-semibold'],
  ['2xl', 'text-2xl font-semibold'],
  ['xl', 'text-xl font-semibold'],
  ['lg', 'text-lg font-semibold'],
  ['md', 'text-md'],
  ['base', 'text-base'],
  ['sm', 'text-sm'],
  ['xs', 'text-xs font-medium'],
] as const;

export const Typography: Story = {
  render: () => (
    <div className="grid gap-4 p-6">
      {typeScale.map(([size, className]) => (
        <div key={size} className="grid grid-cols-[64px_1fr] items-baseline gap-4">
          <span className="font-mono text-xs text-muted-foreground">{size}</span>
          <span className={className}>Interfaces that do not shout</span>
        </div>
      ))}
    </div>
  ),
};
