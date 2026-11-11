import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTodo, deleteTodo, getTodos, reorderTodos, updateTodo } from "../api/todos";
import type { Todo } from "../types";

const KEY = ["todos"] as const;

export function useTodos() {
  return useQuery({ queryKey: KEY, queryFn: getTodos });
}

export function useCreateTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTodo,
    onMutate: async (title: string) => {
      await qc.cancelQueries({ queryKey: KEY });
      const prev = qc.getQueryData<Todo[]>(KEY);
      const existing = prev ?? [];
      const tempId = -Date.now();
      const optimistic: Todo = {
        id: tempId,
        title,
        completed: 0,
        position: existing.length,
      };
      qc.setQueryData<Todo[]>(KEY, [...existing, optimistic]);
      return { prev };
    },
    onError: (_err, _vars, ctx) => qc.setQueryData(KEY, ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: number; patch: { title?: string; completed?: 0 | 1 } }) => updateTodo(id, patch),
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: KEY });
      const prev = qc.getQueryData<Todo[]>(KEY);
      qc.setQueryData<Todo[]>(KEY, (old) => old?.map((t) => (t.id === id ? { ...t, ...patch } : t)) ?? []);
      return { prev };
    },
    onError: (_err, _vars, ctx) => qc.setQueryData(KEY, ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteTodo,
    onMutate: async (id: number) => {
      await qc.cancelQueries({ queryKey: KEY });
      const prev = qc.getQueryData<Todo[]>(KEY);
      qc.setQueryData<Todo[]>(KEY, (old) => old?.filter((t) => t.id !== id) ?? []);
      return { prev };
    },
    onError: (_err, _vars, ctx) => qc.setQueryData(KEY, ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useReorderTodos() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reorderTodos,
    onMutate: async (ids: number[]) => {
      await qc.cancelQueries({ queryKey: KEY });
      const prev = qc.getQueryData<Todo[]>(KEY);
      qc.setQueryData<Todo[]>(KEY, (old) => {
        if (!old) return [];
        const byId = Object.fromEntries(old.map((t) => [t.id, t]));
        return ids.map((id, i) => ({ ...byId[id], position: i })).filter(Boolean);
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => qc.setQueryData(KEY, ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
