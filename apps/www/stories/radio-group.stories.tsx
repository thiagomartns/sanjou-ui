import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { Label } from '@/registry/sanjou/ui/label';
import { RadioGroup, RadioGroupItem } from '@/registry/sanjou/ui/radio-group';

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: {
    docs: {
      description: {
        component: `Picks one option from a small set when all options should stay visible, usually up to five. For longer lists, use Select.

Name the group with \`aria-label\` or, in a form, a \`fieldset\` and \`legend\`, and give each item a \`Label\`. Arrow keys move the selection.`,
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const plans = [
  { value: 'hobby', label: 'Hobby' },
  { value: 'pro', label: 'Pro' },
  { value: 'enterprise', label: 'Enterprise', disabled: true },
];

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="hobby" aria-label="Plan">
      {plans.map((plan) => (
        <div key={plan.value} className="flex items-center gap-2">
          <RadioGroupItem id={plan.value} value={plan.value} disabled={plan.disabled} />
          <Label htmlFor={plan.value}>{plan.label}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
  play: async ({ canvas, userEvent }) => {
    const hobby = canvas.getByRole('radio', { name: 'Hobby' });
    const pro = canvas.getByRole('radio', { name: 'Pro' });

    // Radix moves focus on a timer and selects only while the arrow key is still down,
    // so hold the key until the next item is checked, as a real key press would.
    const arrowDownTo = async (next: HTMLElement) => {
      await userEvent.keyboard('{ArrowDown>}');
      await waitFor(() => expect(next).toBeChecked());
      await userEvent.keyboard('{/ArrowDown}');
      await expect(next).toHaveFocus();
    };

    await expect(hobby).toBeChecked();
    await userEvent.click(hobby);
    await arrowDownTo(pro);
    // The disabled item is skipped: wrapping goes back to the first one.
    await arrowDownTo(hobby);
    await expect(canvas.getByRole('radio', { name: 'Enterprise' })).toBeDisabled();
  },
};
