import axios from "axios";
import type { Todo } from "../types";

const api = axios.create({ baseURL: "/api" });

export async function getTodos(): Promise<Todo[]> {
  const { data } = await api.get<Todo[]>("/todos");
  return data;
}

export async function createTodo(title: string): Promise<Todo> {
  const { data } = await api.post<Todo>("/todos", { title });
  return data;
}

export async function updateTodo(id: number, patch: { title?: string; completed?: 0 | 1 }): Promise<Todo> {
  const { data } = await api.patch<Todo>(`/todos/${id}`, patch);
  return data;
}

export async function deleteTodo(id: number): Promise<void> {
  await api.delete(`/todos/${id}`);
}

export async function reorderTodos(ids: number[]): Promise<void> {
  await api.patch("/todos/reorder", { ids });
}
