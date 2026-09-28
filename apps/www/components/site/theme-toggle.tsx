'use client';

import { Moon, Sun } from 'lucide-react';

import { Button } from '@/registry/sanjou/ui/button';

export function ThemeToggle() {
  function toggle() {
    const dark = document.documentElement.classList.toggle('dark');
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {
      // storage unavailable: the toggle still works for this page view
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
    </Button>
  );
}
