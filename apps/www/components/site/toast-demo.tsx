'use client';

import { toast } from 'sonner';

import { Button } from '@/registry/sanjou/ui/button';

export function ToastDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() =>
          toast('Project archived', {
            description: 'It stays read-only until you restore it.',
            action: { label: 'Undo', onClick: () => toast('Project restored') },
          })
        }
      >
        Archive project
      </Button>
      <Button variant="outline" onClick={() => toast.success('Deploy finished')}>
        Show success
      </Button>
      <Button variant="outline" onClick={() => toast.error('Deploy failed')}>
        Show error
      </Button>
    </div>
  );
}
