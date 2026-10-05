import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, within } from 'storybook/test';

import { Label } from '@/registry/sanjou/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/registry/sanjou/ui/select';

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    docs: {
      description: {
        component: `Picks one value from a list in a form, such as a time zone or a role. The trigger has the same box, states and text size as Input, so both line up in a form. Use \`SelectGroup\` and \`SelectLabel\` to organize long lists.

For a few options that should all stay visible, use RadioGroup. For actions, use DropdownMenu.`,
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const regions = [
  { value: 'gru', label: 'São Paulo (gru1)' },
  { value: 'iad', label: 'Washington (iad1)' },
  { value: 'fra', label: 'Frankfurt (fra1)' },
  { value: 'hnd', label: 'Tokyo (hnd1)', disabled: true },
];

function RegionSelect(props: {
  id: string;
  defaultValue?: string;
  disabled?: boolean;
  invalid?: boolean;
  defaultOpen?: boolean;
  onValueChange?: (value: string) => void;
}) {
  const { id, invalid, ...rootProps } = props;
  return (
    <div className="grid w-64 gap-2">
      <Label htmlFor={id}>Region</Label>
      <Select {...rootProps}>
        <SelectTrigger
          id={id}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? `${id}-error` : undefined}
        >
          <SelectValue placeholder="Choose a region" />
        </SelectTrigger>
        <SelectContent>
          {regions.map((region) => (
            <SelectItem key={region.value} value={region.value} disabled={region.disabled}>
              {region.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {invalid && (
        <p id={`${id}-error`} className="text-sm text-danger-text">
          Choose a region to deploy to.
        </p>
      )}
    </div>
  );
}

export const Default: Story = {
  args: { onValueChange: fn() },
  render: (args) => <RegionSelect id="select-region" onValueChange={args.onValueChange} />,
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    // Content renders in a portal on document.body, outside the story canvas.
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('combobox', { name: 'Region' });
    await expect(trigger).toHaveTextContent('Choose a region');

    // Keyboard: open, move, select.
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    const listbox = await body.findByRole('listbox');
    await waitFor(() =>
      expect(within(listbox).getByRole('option', { name: 'São Paulo (gru1)' })).toHaveFocus(),
    );
    await userEvent.keyboard('{ArrowDown}');
    await expect(body.getByRole('option', { name: 'Washington (iad1)' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');

    await waitFor(() => expect(body.queryByRole('listbox')).not.toBeInTheDocument());
    await expect(args.onValueChange).toHaveBeenLastCalledWith('iad');
    await expect(trigger).toHaveTextContent('Washington (iad1)');
    await expect(trigger).toHaveFocus();

    // Escape closes without changing the value.
    await userEvent.keyboard('{Enter}');
    await body.findByRole('listbox');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('listbox')).not.toBeInTheDocument());
    await expect(trigger).toHaveTextContent('Washington (iad1)');
    await expect(trigger).toHaveFocus();
    await expect(args.onValueChange).toHaveBeenCalledOnce();
  },
};

export const Open: Story = {
  render: () => <RegionSelect id="select-open" defaultValue="gru" defaultOpen />,
  parameters: {
    // While open, Radix sets aria-hidden on the rest of the page and the trigger stays
    // focusable, which axe flags even though focus is trapped in the listbox. Select has no
    // modal={false} escape hatch (DropdownMenu does), so only this rule is off, only here.
    a11y: { config: { rules: [{ id: 'aria-hidden-focus', enabled: false }] } },
  },
};

export const Disabled: Story = {
  render: () => <RegionSelect id="select-disabled" defaultValue="gru" disabled />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('combobox', { name: 'Region' })).toBeDisabled();
  },
};

export const Invalid: Story = {
  render: () => <RegionSelect id="select-invalid" invalid />,
};

export const Grouped: Story = {
  render: () => (
    <div className="grid w-64 gap-2">
      <Label htmlFor="select-timezone">Time zone</Label>
      <Select defaultValue="brt">
        <SelectTrigger id="select-timezone">
          <SelectValue placeholder="Choose a time zone" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>South America</SelectLabel>
            <SelectItem value="brt">Brasília (BRT)</SelectItem>
            <SelectItem value="art">Buenos Aires (ART)</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Europe</SelectLabel>
            <SelectItem value="gmt">London (GMT)</SelectItem>
            <SelectItem value="cet">Berlin (CET)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};
