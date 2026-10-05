import { CircleCheck, Copy, MoreHorizontal, Search, Trash2 } from 'lucide-react';

import { Code } from '@/components/site/code';
import { Preview } from '@/components/site/preview';
import { ThemeToggle } from '@/components/site/theme-toggle';
import { Alert, AlertDescription, AlertTitle } from '@/registry/sanjou/ui/alert';
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
import { Checkbox } from '@/registry/sanjou/ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/registry/sanjou/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/registry/sanjou/ui/dropdown-menu';
import { Input } from '@/registry/sanjou/ui/input';
import { Label } from '@/registry/sanjou/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/sanjou/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/registry/sanjou/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/sanjou/ui/select';
import { Separator } from '@/registry/sanjou/ui/separator';
import { Skeleton } from '@/registry/sanjou/ui/skeleton';
import { Switch } from '@/registry/sanjou/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/sanjou/ui/tabs';
import { Textarea } from '@/registry/sanjou/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/registry/sanjou/ui/tooltip';

const registriesSnippet = `{
  "registries": {
    "@sanjou": "https://sanjou-ui.vercel.app/r/{name}.json"
  }
}`;

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24">
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background/90 backdrop-blur">
        <span className="font-semibold tracking-[-0.01em]">Sanjou UI</span>
        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <a href="#install">Install</a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="#components">Components</a>
          </Button>
          <ThemeToggle />
        </nav>
      </header>

      <section className="grid gap-4 py-16">
        <Badge variant="brand" className="w-fit">
          v0.1 · beta
        </Badge>
        <h1 className="text-4xl font-semibold text-balance">Interfaces that do not shout.</h1>
        <p className="max-w-prose text-md text-muted-foreground">
          A quiet design system for dense product UIs. Radix primitives, Tailwind CSS 4 and OKLCH
          tokens, installed shadcn-style: the code lands in your project and is yours to edit.
        </p>
      </section>

      <section id="install" className="grid scroll-mt-20 gap-4">
        <h2 className="text-2xl font-semibold">Install</h2>
        <ol className="grid list-decimal gap-4 pl-5 text-sm">
          <li className="grid gap-2">
            <span>
              Start from a Next.js + Tailwind CSS 4 project with shadcn/ui initialized (
              <code className="font-mono">npx shadcn@latest init</code>).
            </span>
          </li>
          <li className="grid gap-2">
            <span>
              Add the Sanjou registry to <code className="font-mono">components.json</code>:
            </span>
            <Code>{registriesSnippet}</Code>
          </li>
          <li className="grid gap-2">
            <span>Install the theme first, then any component:</span>
            <Code>{`npx shadcn@latest add @sanjou/theme\nnpx shadcn@latest add @sanjou/button @sanjou/input @sanjou/label`}</Code>
          </li>
          <li className="grid gap-2">
            <span>
              Load Geist with <code className="font-mono">next/font/google</code> using the CSS
              variables <code className="font-mono">--font-geist-sans</code> and{' '}
              <code className="font-mono">--font-geist-mono</code>.
            </span>
          </li>
        </ol>
      </section>

      <section id="components" className="grid scroll-mt-20 gap-12 pt-16">
        <h2 className="text-2xl font-semibold">Components</h2>

        <Preview
          name="button"
          title="Button"
          description="Ink for the main action, indigo for brand moments. One primary per region."
        >
          <Button>Create project</Button>
          <Button variant="secondary">Duplicate</Button>
          <Button variant="outline">
            <Search /> Search
          </Button>
          <Button variant="ghost">Cancel</Button>
          <Button variant="brand">Upgrade plan</Button>
          <Button variant="destructive">Delete workspace</Button>
        </Preview>

        <Preview
          name="input"
          title="Input"
          description="32px field with a label, help text and an error state."
        >
          <div className="grid w-full max-w-sm gap-1.5">
            <Label htmlFor="slug">Workspace slug</Label>
            <Input id="slug" placeholder="acme-production" aria-describedby="slug-help" />
            <p id="slug-help" className="text-sm text-muted-foreground">
              Shown in the URL and in invites.
            </p>
          </div>
        </Preview>

        <Preview
          name="badge"
          title="Badge"
          description="Status never relies on color alone: the word carries the meaning."
        >
          <Badge>Draft</Badge>
          <Badge variant="outline">v0.1.0</Badge>
          <Badge variant="brand">Beta</Badge>
          <Badge variant="success" dot>
            Operational
          </Badge>
          <Badge variant="warning" dot>
            Degraded
          </Badge>
          <Badge variant="danger" dot>
            Failed
          </Badge>
        </Preview>

        <Preview
          name="card"
          title="Card"
          description="Separated by borders, not shadows. Actions sit in the footer."
        >
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>API keys</CardTitle>
              <CardDescription>
                Use these keys to authenticate server-side requests.
              </CardDescription>
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
        </Preview>
        <Preview
          name="textarea"
          title="Textarea"
          description="Grows with its content. Same border, focus and error states as Input."
        >
          <div className="grid w-full max-w-sm gap-1.5">
            <Label htmlFor="project-description">Description</Label>
            <Textarea id="project-description" placeholder="What is this project for?" />
          </div>
        </Preview>

        <Preview
          name="separator"
          title="Separator"
          description="A hairline in the border color. Decorative unless it carries meaning."
        >
          <div className="grid w-full max-w-sm gap-3 text-sm">
            <p className="font-medium">Sanjou UI</p>
            <Separator />
            <div className="flex h-5 items-center gap-3 text-muted-foreground">
              <span>Docs</span>
              <Separator orientation="vertical" />
              <span>Changelog</span>
              <Separator orientation="vertical" />
              <span>GitHub</span>
            </div>
          </div>
        </Preview>

        <Preview
          name="skeleton"
          title="Skeleton"
          description="Mirrors the shape of the content it replaces. Stops pulsing for reduced motion."
        >
          <div aria-busy="true" className="flex w-full max-w-sm items-center gap-3">
            <span className="sr-only">Loading profile</span>
            <Skeleton className="size-10 rounded-full" />
            <div className="grid flex-1 gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </Preview>

        <Preview
          name="alert"
          title="Alert"
          description="Inline feedback on a tinted surface. Title says what happened, description says what to do."
        >
          <Alert variant="success" role="status" className="max-w-md">
            <CircleCheck />
            <AlertTitle>Deploy finished</AlertTitle>
            <AlertDescription>Version 0.1.0 is live in production.</AlertDescription>
          </Alert>
        </Preview>

        <Preview
          name="checkbox"
          title="Checkbox"
          description="For choices that apply on submit. Mixed state for partial selections."
        >
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Checkbox id="preview-terms" defaultChecked />
              <Label htmlFor="preview-terms">Accept the terms of service</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="preview-all" checked="indeterminate" />
              <Label htmlFor="preview-all">Select all projects</Label>
            </div>
          </div>
        </Preview>

        <Preview
          name="switch"
          title="Switch"
          description="For settings that apply immediately. Ink when on, never color alone."
        >
          <div className="flex items-center gap-2">
            <Switch id="preview-notifications" defaultChecked />
            <Label htmlFor="preview-notifications">Email notifications</Label>
          </div>
        </Preview>

        <Preview
          name="radio-group"
          title="Radio group"
          description="One choice from a short, visible list. Arrow keys move the selection."
        >
          <RadioGroup defaultValue="pro" aria-label="Plan">
            {['Hobby', 'Pro', 'Enterprise'].map((plan) => (
              <div key={plan} className="flex items-center gap-2">
                <RadioGroupItem id={`preview-${plan}`} value={plan.toLowerCase()} />
                <Label htmlFor={`preview-${plan}`}>{plan}</Label>
              </div>
            ))}
          </RadioGroup>
        </Preview>

        <Preview
          name="dialog"
          title="Dialog"
          description="Modal window for focused tasks and confirmations. Traps focus until closed."
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete project</Button>
            </DialogTrigger>
            <DialogContent role="alertdialog" showCloseButton={false} className="sm:max-w-md">
              <DialogHeader className="pr-0">
                <DialogTitle>Delete this project?</DialogTitle>
                <DialogDescription>
                  This removes all deployments and environment variables. You cannot undo this.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="destructive">Delete project</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Preview>

        <Preview
          name="dropdown-menu"
          title="Dropdown menu"
          description="Actions or options behind a trigger. Arrow keys move, Escape closes."
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Project actions">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash2 />
                Delete project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Preview>

        <Preview
          name="popover"
          title="Popover"
          description="Floating panel for short forms and details. Escape or a click outside closes it."
        >
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Edit dimensions</Button>
            </PopoverTrigger>
            <PopoverContent aria-label="Dimensions" className="grid gap-4">
              <div className="grid gap-1">
                <p className="text-sm font-medium">Dimensions</p>
                <p className="text-sm text-muted-foreground">Set the size of the layer.</p>
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="preview-width">Width</Label>
                <Input id="preview-width" defaultValue="100%" className="col-span-2" />
                <Label htmlFor="preview-height">Height</Label>
                <Input id="preview-height" defaultValue="25px" className="col-span-2" />
              </div>
            </PopoverContent>
          </Popover>
        </Preview>

        <Preview
          name="select"
          title="Select"
          description="Picks one option from a list. The trigger lines up with Input in forms."
        >
          <div className="grid w-full max-w-xs gap-2">
            <Label htmlFor="preview-region">Region</Label>
            <Select>
              <SelectTrigger id="preview-region">
                <SelectValue placeholder="Choose a region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gru">São Paulo (gru1)</SelectItem>
                <SelectItem value="iad">Washington (iad1)</SelectItem>
                <SelectItem value="fra">Frankfurt (fra1)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Preview>

        <Preview
          name="tabs"
          title="Tabs"
          description="Switches between related panels. Arrow keys move between tabs."
        >
          <Tabs defaultValue="overview" className="w-full max-w-sm">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="text-sm text-muted-foreground">
              Three deployments this week, all healthy.
            </TabsContent>
            <TabsContent value="activity" className="text-sm text-muted-foreground">
              No activity in the last 24 hours.
            </TabsContent>
            <TabsContent value="settings" className="text-sm text-muted-foreground">
              Project settings are read-only for viewers.
            </TabsContent>
          </Tabs>
        </Preview>

        <Preview
          name="tooltip"
          title="Tooltip"
          description="Names icon-only controls. Opens on hover and keyboard focus."
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Copy API key">
                <Copy />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy API key</TooltipContent>
          </Tooltip>
        </Preview>
      </section>
    </div>
  );
}
