import { AlertTriangle, ClipboardList, RefreshCcw } from 'lucide-react';
import type { Todo } from '../../api-client/todos';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  onToggle: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  updatingIds: number[];
  deletingIds: number[];
}

function TodoListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-24 animate-pulse rounded-2xl border border-border bg-card/60" />
      ))}
    </div>
  );
}

export function TodoList({
  todos,
  isLoading,
  errorMessage,
  onRetry,
  onToggle,
  onDelete,
  updatingIds,
  deletingIds,
}: TodoListProps) {
  if (isLoading) {
    return <TodoListSkeleton />;
  }

  if (errorMessage) {
    return (
      <Card className="p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Unable to load todos</h3>
        <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
        <Button type="button" variant="outline" className="mt-5" onClick={onRetry}>
          <RefreshCcw className="h-4 w-4" />
          Retry
        </Button>
      </Card>
    );
  }

  if (todos.length === 0) {
    return (
      <Card className="p-10 text-center">
        <div className="mx-auto flex h-16 w-16 animate-float items-center justify-center rounded-2xl bg-gradient-primary/15 text-primary">
          <ClipboardList className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-xl font-semibold">No todos yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">Create your first task to see it appear here instantly.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          isUpdating={updatingIds.includes(todo.id)}
          isDeleting={deletingIds.includes(todo.id)}
        />
      ))}
    </div>
  );
}
