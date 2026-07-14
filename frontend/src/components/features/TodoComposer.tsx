import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';

interface TodoComposerProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  errorMessage: string | null;
}

export function TodoComposer({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onSubmit,
  isSubmitting,
  errorMessage,
}: TodoComposerProps) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand-teal">Create task</p>
          <h2 className="mt-1 text-xl font-semibold text-card-foreground">Capture what matters next</h2>
        </div>
        <div className="hidden rounded-2xl bg-gradient-primary/15 p-3 text-primary sm:block">
          <Plus className="h-5 w-5" />
        </div>
      </div>
      <form className="space-y-3" onSubmit={onSubmit}>
        <label htmlFor="todo-title" className="text-sm font-medium text-foreground">
          Todo title <span aria-hidden="true" className="text-primary">*</span>
        </label>
        <Input
          id="todo-title"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Add a task that should persist to the backend"
          aria-required="true"
          aria-describedby={errorMessage ? 'todo-form-error' : undefined}
          disabled={isSubmitting}
        />
        <div className="space-y-2">
          <label htmlFor="todo-description" className="text-sm font-medium text-foreground">
            Description <span className="text-muted-foreground">(optional)</span>
          </label>
          <Textarea
            id="todo-description"
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            placeholder="Add any details you want to remember"
            aria-describedby={errorMessage ? 'todo-form-error' : 'todo-form-hint'}
            disabled={isSubmitting}
          />
        </div>
        {errorMessage ? (
          <p id="todo-form-error" className="text-sm text-destructive">
            {errorMessage}
          </p>
        ) : (
          <p id="todo-form-hint" className="text-sm text-muted-foreground">Todos are saved immediately to the API-backed shared list.</p>
        )}
        <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting || title.trim().length === 0} aria-disabled={isSubmitting || title.trim().length === 0}>
          <Plus className="h-4 w-4" />
          {isSubmitting ? 'Creating…' : 'Create todo'}
        </Button>
      </form>
    </Card>
  );
}
