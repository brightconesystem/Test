import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children: ReactNode;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
        variant === 'primary' && 'bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95',
        variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/85',
        variant === 'outline' && 'border border-border bg-background/80 text-foreground hover:bg-secondary',
        variant === 'ghost' && 'text-muted-foreground hover:bg-secondary hover:text-foreground',
        variant === 'destructive' && 'bg-destructive text-destructive-foreground hover:opacity-90',
        size === 'sm' && 'h-9 px-3 text-sm',
        size === 'md' && 'h-11 px-4 py-2 text-sm',
        size === 'lg' && 'h-12 px-6 text-base',
        size === 'icon' && 'h-10 w-10',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
