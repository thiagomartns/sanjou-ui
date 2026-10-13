import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Label } from '@/registry/sanjou/ui/label';
import { Textarea } from '@/registry/sanjou/ui/textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    docs: {
      description: {
        component: `A multi-line text field for comments, descriptions and messages. It works like Input: pair it with a \`Label\`, set \`aria-invalid\` to show an error and link the message with \`aria-describedby\`.`,
      },
    },
  },
  decorators: [(Story) => <div className="grid max-w-sm gap-1.5">{Story()}</div>],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <>
      <Label htmlFor="description">Description</Label>
      <Textarea id="description" placeholder="What is this project for?" />
    </>
  ),
  play: async ({ canvas, userEvent }) => {
    const textarea = canvas.getByLabelText('Description');
    await userEvent.type(textarea, 'Design system{Enter}for internal tools');
    await expect(textarea).toHaveValue('Design system\nfor internal tools');
  },
};

export const Invalid: Story = {
  render: () => (
    <>
      <Label htmlFor="notes">Release notes</Label>
      <Textarea id="notes" defaultValue="tbd" aria-invalid aria-describedby="notes-error" />
      <p id="notes-error" className="text-sm text-danger-text">
        Write at least one full sentence.
      </p>
    </>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Release notes')).toHaveAccessibleDescription(
      'Write at least one full sentence.',
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <>
      <Label htmlFor="audit">Audit log</Label>
      <Textarea id="audit" defaultValue="Read-only while the export runs." disabled />
    </>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Audit log')).toBeDisabled();
  },
};
