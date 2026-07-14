import { CheckCheck, ListTodo, LoaderCircle } from 'lucide-react';
import type { Todo } from '../api-client/todos';
import { TodoComposer } from '../components/features/TodoComposer';
import { TodoList } from '../components/features/TodoList';
import { Card } from '../components/ui/Card';

interface TodoDashboardPageProps {
  todos: Todo[];
  isLoading: boolean;
  listError: string | null;
  createError: string | null;
  createTitle: string;
  isCreating: boolean;
  updatingIds: number[];
  deletingIds: number[];
  onCreateTitleChange: (value: string) => void;
  onCreate: (event: React.FormEvent<HTMLFormElement>) => void;
  onRetry: () => void;
  onToggle: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

export function TodoDashboardPage({
  todos,
  isLoading,
  listError,
  createError,
  createTitle,
  isCreating,
  updatingIds,
  deletingIds,
  onCreateTitleChange,
  onCreate,
  onRetry,
  onToggle,
  onDelete,
}: TodoDashboardPageProps) {
  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = todos.length - completedCount;
  const isMutating = isCreating || updatingIds.length > 0 || deletingIds.length > 0;

  return (
    <section className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)] xl:gap-8">
      <div className="space-y-6">
        <Card className="overflow-hidden p-6">
          <div className="rounded-2xl bg-gradient-primary p-[1px]">
            <div className="rounded-[15px] bg-card/95 p-5">
              <p className="text-sm font-medium text-brand-teal">Overview</p>
              <h2 className="mt-2 text-2xl font-semibold leading-tight">Stay on top of your shared todo backlog.</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Create, toggle, and delete todos with immediate API persistence and polished feedback.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface-secondary p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ListTodo className="h-4 w-4" /> Active
              </div>
              <p className="mt-2 text-2xl font-semibold">{activeCount}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface-secondary p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCheck className="h-4 w-4" /> Completed
              </div>
              <p className="mt-2 text-2xl font-semibold">{completedCount}</p>
            </div>
          </div>
          {isMutating ? (
            <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <LoaderCircle className="h-4 w-4 animate-spin" /> Syncing changes with the backend…
            </div>
          ) : (
            <p className="mt-5 text-sm text-muted-foreground">All interactions use the live FastAPI contract under /api/todos.</p>
          )}
        </Card>
        <TodoComposer
          title={createTitle}
          onTitleChange={onCreateTitleChange}
          onSubmit={onCreate}
          isSubmitting={isCreating}
          errorMessage={createError}
        />
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-teal">Synced list</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Your persisted todos</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Toggle completion to verify persistence after refresh, or delete items to keep the list clean.
          </p>
        </div>
        <TodoList
          todos={todos}
          isLoading={isLoading}
          errorMessage={listError}
          onRetry={onRetry}
          onToggle={onToggle}
          onDelete={onDelete}
          updatingIds={updatingIds}
          deletingIds={deletingIds}
        />
      </div>
    </section>
  );
}
