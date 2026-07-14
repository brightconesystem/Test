import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createTodo,
  deleteTodo,
  fetchTodos,
  updateTodo,
  type Todo,
} from './api-client/todos';
import { AppShell } from './components/layout/AppShell';
import { TodoDashboardPage } from './pages/TodoDashboardPage';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createTitle, setCreateTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const loadTodos = useCallback(async () => {
    setIsLoading(true);
    setListError(null);

    try {
      const response = await fetchTodos();
      setTodos(response);
    } catch (error) {
      setListError(error instanceof Error ? error.message : 'Failed to load todos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTodos();
  }, [loadTodos]);

  const handleCreate = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmedTitle = createTitle.trim();

      if (!trimmedTitle) {
        setCreateError('Please enter a todo title before creating.');
        return;
      }

      setIsCreating(true);
      setCreateError(null);

      try {
        const created = await createTodo({ title: trimmedTitle });
        setTodos((current) => [...current, created]);
        setCreateTitle('');
      } catch (error) {
        setCreateError(error instanceof Error ? error.message : 'Unable to create todo.');
      } finally {
        setIsCreating(false);
      }
    },
    [createTitle],
  );

  const handleToggle = useCallback(async (todo: Todo) => {
    setUpdatingIds((current) => [...current, todo.id]);
    setListError(null);

    try {
      const updated = await updateTodo(todo.id, {
        title: todo.title,
        completed: !todo.completed,
      });
      setTodos((current) => current.map((item) => (item.id === todo.id ? updated : item)));
    } catch (error) {
      setListError(error instanceof Error ? error.message : 'Unable to update todo.');
    } finally {
      setUpdatingIds((current) => current.filter((id) => id !== todo.id));
    }
  }, []);

  const handleDelete = useCallback(async (todo: Todo) => {
    setDeletingIds((current) => [...current, todo.id]);
    setListError(null);

    try {
      await deleteTodo(todo.id);
      setTodos((current) => current.filter((item) => item.id !== todo.id));
    } catch (error) {
      setListError(error instanceof Error ? error.message : 'Unable to delete todo.');
    } finally {
      setDeletingIds((current) => current.filter((id) => id !== todo.id));
    }
  }, []);

  const orderedTodos = useMemo(
    () => [...todos].sort((a, b) => Number(a.completed) - Number(b.completed) || a.id - b.id),
    [todos],
  );

  return (
    <AppShell isDark={isDark} onToggleTheme={toggleTheme}>
      <TodoDashboardPage
        todos={orderedTodos}
        isLoading={isLoading}
        listError={listError}
        createError={createError}
        createTitle={createTitle}
        isCreating={isCreating}
        updatingIds={updatingIds}
        deletingIds={deletingIds}
        onCreateTitleChange={setCreateTitle}
        onCreate={handleCreate}
        onRetry={loadTodos}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    </AppShell>
  );
}
