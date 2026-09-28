import { Search } from 'lucide-react';

import { Code } from '@/components/site/code';
import { Preview } from '@/components/site/preview';
import { ThemeToggle } from '@/components/site/theme-toggle';
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
import { Input } from '@/registry/sanjou/ui/input';
import { Label } from '@/registry/sanjou/ui/label';

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
      </section>
    </div>
  );
}
