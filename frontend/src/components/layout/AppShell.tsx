import type { ReactNode } from 'react';
import { MoonStar, SunMedium } from 'lucide-react';
import { Button } from '../ui/Button';

interface AppShellProps {
  children: ReactNode;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function AppShell({ children, isDark, onToggleTheme }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-grid">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(28,201,168,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.15),transparent_24%)]" />
      <header className="relative z-10 border-b border-divider/70 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-teal">BrightCone</p>
            <h1 className="mt-1 text-lg font-semibold text-foreground sm:text-xl">Unified Todo Workspace</h1>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={onToggleTheme}
          >
            {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
          </Button>
        </div>
      </header>
      <main className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">{children}</main>
    </div>
  );
}
