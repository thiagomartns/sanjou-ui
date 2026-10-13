import type { Meta, StoryObj } from '@storybook/react-vite';
import tokens from '@sanjou/tokens/tokens.json';

type TextToken = (typeof tokens.text)[keyof typeof tokens.text];

const meta = {
  title: 'Foundations/Typography',
  // The Docs page is typography.mdx.
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

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

/** `13 / 20` (font size / line height in px), plus tracking when it is not zero. */
function metrics({ $value }: TextToken) {
  const size = $value.fontSize.value;
  const tracking = $value.letterSpacing.value;
  return `${size} / ${Math.round(size * $value.lineHeight)}${tracking ? ` · ${tracking}em` : ''}`;
}

export const Scale: Story = {
  render: () => (
    <div className="grid gap-4 p-6">
      {typeScale.map(([size, className]) => (
        <div key={size} className="grid grid-cols-[64px_160px_1fr] items-baseline gap-4">
          <span className="font-mono text-xs">{size}</span>
          <span className="font-mono text-xs text-muted-foreground">
            {metrics(tokens.text[size])}
          </span>
          <span className={className}>Interfaces that do not shout</span>
        </div>
      ))}
    </div>
  ),
};

export const Families: Story = {
  render: () => (
    <div className="grid gap-4 p-6">
      <div className="grid grid-cols-[64px_1fr] items-baseline gap-4">
        <span className="font-mono text-xs text-muted-foreground">sans</span>
        <span className="text-lg">Geist: interface text, headings and numbers</span>
      </div>
      <div className="grid grid-cols-[64px_1fr] items-baseline gap-4">
        <span className="font-mono text-xs text-muted-foreground">mono</span>
        <span className="font-mono text-lg">Geist Mono: code, keys and IDs</span>
      </div>
      <div className="grid grid-cols-[64px_1fr] items-baseline gap-4">
        <span className="font-mono text-xs text-muted-foreground">weight</span>
        <span className="flex gap-6 text-lg">
          <span className="font-normal">Regular 400</span>
          <span className="font-medium">Medium 500</span>
          <span className="font-semibold">Semibold 600</span>
        </span>
      </div>
    </div>
  ),
};
