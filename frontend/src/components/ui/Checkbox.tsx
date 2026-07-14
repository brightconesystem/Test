import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
  label: string;
}

export function Checkbox({ checked, onToggle, disabled = false, label }: CheckboxProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={checked}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        'flex h-6 w-6 items-center justify-center rounded-md border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-transparent hover:border-primary/60',
        disabled && 'cursor-not-allowed opacity-60',
      )}
    >
      <Check className="h-4 w-4" />
    </button>
  );
}
