import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '@/registry/sanjou/ui/badge';
import { Button } from '@/registry/sanjou/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/registry/sanjou/ui/card';

const meta = {
  title: 'Components/Card',
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithFooter: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>API keys</CardTitle>
        <CardDescription>Use these keys to authenticate server-side requests.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-3">
        <span className="font-mono text-sm tabular-nums">sk_live_••••••••4f2a</span>
        <Badge variant="success" dot>
          Active
        </Badge>
      </CardContent>
      <CardFooter>
        <Button variant="ghost">Revoke</Button>
        <Button>Generate new key</Button>
      </CardFooter>
    </Card>
  ),
};
