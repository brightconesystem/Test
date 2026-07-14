import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../src/App';
import * as todosApi from '../src/api-client/todos';

vi.mock('../src/hooks/useTheme', () => ({
  useTheme: () => ({ isDark: false, toggleTheme: vi.fn() }),
}));

vi.mock('../src/components/layout/AppShell', () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../src/pages/TodoDashboardPage', () => ({
  TodoDashboardPage: (props: any) => (
    <div>
      {props.createError ? <div role="alert">{props.createError}</div> : null}
      {props.listError ? <div role="alert">{props.listError}</div> : null}
      <form onSubmit={props.onCreate}>
        <label htmlFor="todo-title">Todo title</label>
        <input
          id="todo-title"
          aria-label="Todo title"
          value={props.createTitle}
          onChange={(event) => props.onCreateTitleChange(event.target.value)}
        />
        <button type="submit">Create todo</button>
      </form>
      <ul>
        {props.todos.map((todo: any) => (
          <li key={todo.id}>
            <span>{todo.title}</span>
            <span>{todo.completed ? 'completed' : 'active'}</span>
            <button type="button" onClick={() => props.onToggle(todo)}>
              Toggle
            </button>
            <button type="button" onClick={() => props.onDelete(todo)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  ),
}));

const fetchTodosMock = vi.spyOn(todosApi, 'fetchTodos');
const createTodoMock = vi.spyOn(todosApi, 'createTodo');
const updateTodoMock = vi.spyOn(todosApi, 'updateTodo');
const deleteTodoMock = vi.spyOn(todosApi, 'deleteTodo');

beforeEach(() => {
  fetchTodosMock.mockReset();
  createTodoMock.mockReset();
  updateTodoMock.mockReset();
  deleteTodoMock.mockReset();
});

afterEach(() => {
  cleanup();
});

it('create adds an item to rendered state without reload', async () => {
  fetchTodosMock.mockResolvedValue([]);
  createTodoMock.mockResolvedValue({ id: 2, title: 'Write tests', completed: false });

  render(<App />);

  await screen.findByRole('button', { name: 'Create todo' });
  fireEvent.change(screen.getByLabelText('Todo title'), { target: { value: 'Write tests' } });
  fireEvent.click(screen.getByRole('button', { name: 'Create todo' }));

  await screen.findByText('Write tests');
  expect(screen.getByText('active')).toBeInTheDocument();
  expect(fetchTodosMock).toHaveBeenCalledTimes(1);
  expect(createTodoMock).toHaveBeenCalledWith({ title: 'Write tests' });
});

it('toggle updates completed state', async () => {
  fetchTodosMock.mockResolvedValue([{ id: 1, title: 'Write tests', completed: false }]);
  updateTodoMock.mockResolvedValue({ id: 1, title: 'Write tests', completed: true });

  render(<App />);

  await screen.findByText('Write tests');
  fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));

  await screen.findByText('completed');
  expect(updateTodoMock).toHaveBeenCalledWith(1, { title: 'Write tests', completed: true });
});

it('delete removes the item', async () => {
  fetchTodosMock.mockResolvedValue([{ id: 1, title: 'Write tests', completed: false }]);
  deleteTodoMock.mockResolvedValue(undefined);

  render(<App />);

  await screen.findByText('Write tests');
  fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

  await waitFor(() => expect(screen.queryByText('Write tests')).not.toBeInTheDocument());
  expect(deleteTodoMock).toHaveBeenCalledWith(1);
});

it('error states render user feedback', async () => {
  fetchTodosMock.mockResolvedValue([]);
  createTodoMock.mockRejectedValue(new Error('Unable to create todo.'));

  render(<App />);

  await screen.findByRole('button', { name: 'Create todo' });
  fireEvent.change(screen.getByLabelText('Todo title'), { target: { value: 'Broken' } });
  fireEvent.click(screen.getByRole('button', { name: 'Create todo' }));

  expect(await screen.findByRole('alert')).toHaveTextContent('Unable to create todo.');
});
