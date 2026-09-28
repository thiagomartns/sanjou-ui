import type { ReactNode } from 'react';

export function Code({ children }: { children: ReactNode }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-muted px-4 py-3 font-mono text-sm leading-5">
      <code>{children}</code>
    </pre>
  );
}
