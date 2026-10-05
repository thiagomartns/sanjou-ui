import type { Meta, StoryObj } from '@storybook/react-vite';

import { Card, CardContent, CardFooter, CardHeader } from '@/registry/sanjou/ui/card';
import { Separator } from '@/registry/sanjou/ui/separator';
import { Skeleton } from '@/registry/sanjou/ui/skeleton';

/** Mirrors Patterns/Settings so heights and spacing can be compared side by side. */
function SettingsSkeleton() {
  return (
    <Card className="w-md" role="status" aria-label="Loading notification settings">
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-56" />
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid gap-4">
          {[0, 1].map((row) => (
            <div key={row} className="flex items-start justify-between gap-4">
              <div className="grid gap-0.5">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-64" />
              </div>
              <Skeleton className="h-5 w-9 rounded-full" />
            </div>
          ))}
        </div>
        <Separator />
        <div className="grid gap-3">
          <Skeleton className="h-5 w-32" />
          <div className="flex gap-6">
            {[0, 1, 2].map((option) => (
              <Skeleton key={option} className="h-5 w-16" />
            ))}
          </div>
        </div>
        <Separator />
        <div className="grid gap-1.5">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-16 w-full" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-28" />
      </CardFooter>
    </Card>
  );
}

const meta = {
  title: 'Patterns/Loading',
  component: SettingsSkeleton,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof SettingsSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Settings: Story = {};
