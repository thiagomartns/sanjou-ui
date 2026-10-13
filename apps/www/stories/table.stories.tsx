import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MoreHorizontal } from 'lucide-react';
import { expect, within } from 'storybook/test';

import { Avatar, AvatarFallback } from '@/registry/sanjou/ui/avatar';
import { Badge } from '@/registry/sanjou/ui/badge';
import { Button } from '@/registry/sanjou/ui/button';
import { Checkbox } from '@/registry/sanjou/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/registry/sanjou/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/registry/sanjou/ui/table';

const invoices = [
  { id: 'inv-1', name: 'Olivia Martin', initials: 'OM', status: 'Paid', amount: 316 },
  { id: 'inv-2', name: 'Jackson Lee', initials: 'JL', status: 'Pending', amount: 242 },
  { id: 'inv-3', name: 'Isabella Nguyen', initials: 'IN', status: 'Overdue', amount: 837 },
  { id: 'inv-4', name: 'William Kim', initials: 'WK', status: 'Paid', amount: 874 },
] as const;

const statusVariant = { Paid: 'success', Pending: 'warning', Overdue: 'danger' } as const;
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function Customer({ name, initials }: { name: string; initials: string }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar size="sm">
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      {name}
    </div>
  );
}

const meta = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    docs: {
      description: {
        component: `Records that people compare across columns, such as invoices, members or logs. For a list with one main value per item, use a list instead. Sorting, selection state and pagination belong to a data table built on top of it.

Compact by default: 36px header, 40px rows, rows separated by borders instead of stripes. Put it in a \`Card\` or a \`rounded-lg border\` container; the last row drops its border. Align numbers right with \`text-right tabular-nums\`, in the header too.

Selected rows take \`data-state="selected"\`. Name every checkbox and every icon button, and keep \`TableCaption\` short.`,
      },
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table className="max-w-2xl">
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead className="w-30">Status</TableHead>
          <TableHead className="w-30 text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>
              <Customer {...invoice} />
            </TableCell>
            <TableCell>
              <Badge variant={statusVariant[invoice.status]} dot>
                {invoice.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right tabular-nums">{usd.format(invoice.amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  play: async ({ canvas }) => {
    const table = canvas.getByRole('table', { name: 'A list of your recent invoices.' });
    await expect(within(table).getAllByRole('row')).toHaveLength(5);
    await expect(within(table).getAllByRole('columnheader')).toHaveLength(3);
  },
};

function SelectableTable() {
  const [selected, setSelected] = useState<string[]>(['inv-3']);
  const all = selected.length === invoices.length;
  const toggle = (id: string, on: boolean) =>
    setSelected((ids) => (on ? [...ids, id] : ids.filter((x) => x !== id)));

  return (
    <div className="max-w-2xl overflow-hidden rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                aria-label="Select all"
                checked={all ? true : selected.length ? 'indeterminate' : false}
                onCheckedChange={(on) => setSelected(on === true ? invoices.map((i) => i.id) : [])}
              />
            </TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="w-30">Status</TableHead>
            <TableHead className="w-30 text-right">Amount</TableHead>
            <TableHead className="w-12">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => {
            const isSelected = selected.includes(invoice.id);
            return (
              <TableRow key={invoice.id} data-state={isSelected ? 'selected' : undefined}>
                <TableCell>
                  <Checkbox
                    aria-label={`Select ${invoice.name}`}
                    checked={isSelected}
                    onCheckedChange={(on) => toggle(invoice.id, on === true)}
                  />
                </TableCell>
                <TableCell>
                  <Customer {...invoice} />
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[invoice.status]} dot>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {usd.format(invoice.amount)}
                </TableCell>
                <TableCell className="px-2 text-right">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Open actions for ${invoice.name}`}
                      >
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View invoice</DropdownMenuItem>
                      <DropdownMenuItem>Send reminder</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export const Selectable: Story = {
  render: () => <SelectableTable />,
  play: async ({ canvas, userEvent }) => {
    const selectAll = canvas.getByRole('checkbox', { name: 'Select all' });
    await expect(selectAll).toHaveAttribute('aria-checked', 'mixed');

    const olivia = canvas.getByRole('checkbox', { name: 'Select Olivia Martin' });
    await userEvent.click(olivia);
    await expect(olivia.closest('tr')).toHaveAttribute('data-state', 'selected');

    await userEvent.click(selectAll);
    for (const box of canvas.getAllByRole('checkbox')) await expect(box).toBeChecked();

    await userEvent.click(selectAll);
    await expect(olivia).not.toBeChecked();
    await expect(olivia.closest('tr')).not.toHaveAttribute('data-state');

    // End on a partial selection so the canvas shows the selected row.
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select Isabella Nguyen' }));
    await expect(selectAll).toHaveAttribute('aria-checked', 'mixed');
  },
};

export const Empty: Story = {
  render: () => (
    <div className="max-w-2xl overflow-hidden rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead className="w-30">Status</TableHead>
            <TableHead className="w-30 text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={3} className="h-24 text-center">
              <p className="text-sm font-medium">No invoices yet</p>
              <p className="text-sm text-muted-foreground">Invoices you send appear here.</p>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('cell', { name: /No invoices yet/ })).toHaveAttribute(
      'colspan',
      '3',
    );
  },
};

export const WithFooter: Story = {
  render: () => (
    <div className="max-w-2xl overflow-hidden rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead className="w-30 text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.name}</TableCell>
              <TableCell className="text-right tabular-nums">
                {usd.format(invoice.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell className="text-right tabular-nums">
              {usd.format(invoices.reduce((sum, i) => sum + i.amount, 0))}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  ),
};
