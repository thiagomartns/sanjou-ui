import type { ReactNode } from 'react';

import { Code } from './code';

export function Preview({
  name,
  title,
  description,
  children,
}: {
  name: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section id={name} className="grid gap-3 scroll-mt-20">
      <div className="grid gap-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex min-h-28 flex-wrap items-center gap-2 rounded-lg border border-border bg-background p-6">
        {children}
      </div>
      <Code>npx shadcn@latest add @sanjou/{name}</Code>
    </section>
  );
}
