import { apiDelete, apiGet, apiPatch, apiPost } from './base';

export type Todo = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
};

export type TodoCreate = {
  title: string;
  description: string | null;
};

export type TodoUpdate = {
  title?: string | null;
  description?: string | null;
  completed?: boolean | null;
};

export function fetchTodos(): Promise<Todo[]> {
  return apiGet<Todo[]>('/api/todos');
}

export function createTodo(body: TodoCreate): Promise<Todo> {
  return apiPost<Todo, TodoCreate>('/api/todos', body);
}

export function updateTodo(id: number, body: TodoUpdate): Promise<Todo> {
  return apiPatch<Todo, TodoUpdate>(`/api/todos/${id}`, body);
}

export function deleteTodo(id: number): Promise<void> {
  return apiDelete(`/api/todos/${id}`);
}
