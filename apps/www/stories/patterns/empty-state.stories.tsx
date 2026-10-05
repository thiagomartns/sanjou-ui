import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleHelp, FolderOpen, Plus } from 'lucide-react';
import { expect, fn, waitFor, within } from 'storybook/test';

import { Alert, AlertDescription, AlertTitle } from '@/registry/sanjou/ui/alert';
import { Button } from '@/registry/sanjou/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/registry/sanjou/ui/tooltip';

type ProjectsEmptyProps = { onCreate: () => void };

function ProjectsEmpty({ onCreate }: ProjectsEmptyProps) {
  return (
    <section aria-labelledby="projects-heading" className="grid w-md gap-4">
      <div className="flex items-center justify-between">
        <h2 id="projects-heading" className="text-lg leading-7 font-semibold tracking-[-0.01em]">
          Projects
        </h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="About projects">
              <CircleHelp />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">A project groups deploys, domains and secrets</TooltipContent>
        </Tooltip>
      </div>
      {/* An empty list is not urgent, so the alert is announced politely. */}
      <Alert role="status">
        <FolderOpen />
        <AlertTitle>No projects yet</AlertTitle>
        <AlertDescription>
          <p>Create a project to connect a repository and start deploying.</p>
        </AlertDescription>
      </Alert>
      <div>
        <Button variant="brand" onClick={onCreate}>
          <Plus />
          Create project
        </Button>
      </div>
    </section>
  );
}

const meta = {
  title: 'Patterns/Empty state',
  component: ProjectsEmpty,
  parameters: {
    docs: {
      description: {
        component: `What a list shows before it has any items: a heading, what the list is for, and the action that creates the first item.`,
      },
    },
    layout: 'centered',
  },
  args: { onCreate: fn() },
} satisfies Meta<typeof ProjectsEmpty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    // Tooltip content renders in a portal on document.body, outside the story canvas.
    const body = within(canvasElement.ownerDocument.body);
    const help = canvas.getByRole('button', { name: 'About projects' });

    await userEvent.tab();
    await expect(help).toHaveFocus();
    await expect(await body.findByRole('tooltip')).toHaveTextContent(
      'A project groups deploys, domains and secrets',
    );
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('tooltip')).not.toBeInTheDocument());

    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Create project' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onCreate).toHaveBeenCalledOnce();
  },
};
