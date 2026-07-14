import { LoaderCircle, Trash2 } from 'lucide-react';
import type { Todo } from '../../api-client/todos';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Checkbox } from '../ui/Checkbox';
import { cn } from '../../utils/cn';

interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function TodoItem({ todo, onToggle, onDelete, isUpdating, isDeleting }: TodoItemProps) {
  const isBusy = isUpdating || isDeleting;

  return (
    <Card className="group flex items-center justify-between gap-4 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow sm:p-5">
      <div className="flex min-w-0 items-center gap-3">
        <Checkbox
          checked={todo.completed}
          disabled={isBusy}
          onToggle={() => onToggle(todo)}
          label={todo.completed ? `Mark ${todo.title} incomplete` : `Mark ${todo.title} complete`}
        />
        <div className="min-w-0">
          <p className={cn('truncate text-sm font-medium sm:text-base', todo.completed && 'text-muted-foreground line-through')}>
            {todo.title}
          </p>
          {todo.description ? (
            <p className={cn('mt-1 line-clamp-2 text-xs text-muted-foreground sm:text-sm', todo.completed && 'line-through')}>
              {todo.description}
            </p>
          ) : null}
          <p className="mt-1 text-xs text-muted-foreground">
            {todo.completed ? 'Completed and synced with the API' : 'Open and ready for action'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isUpdating ? <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" /> : null}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Delete ${todo.title}`}
          disabled={isBusy}
          onClick={() => onDelete(todo)}
          className="text-muted-foreground hover:text-destructive"
        >
          {isDeleting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
      </div>
    </Card>
  );
}
