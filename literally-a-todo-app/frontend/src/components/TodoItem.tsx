import { useRef, useState } from "react";
import { useDeleteTodo, useUpdateTodo } from "../hooks/useTodos";
import { cn } from "../lib/cn";
import type { Todo } from "../types";
import { Button } from "./ui/Button";
import { Checkbox } from "./ui/Checkbox";
import { toast } from "./ui/Toast";
import { Icon } from "./Icon";

interface Props {
  todo: Todo;
  dragHandleProps?: Record<string, unknown>;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function TodoItem({ todo, dragHandleProps, isFirst, isLast, onMoveUp, onMoveDown }: Props) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  const completed = todo.completed === 1;

  function startEdit() {
    setEditTitle(todo.title);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function cancelEdit() {
    setEditing(false);
    setEditTitle(todo.title);
  }

  function saveEdit() {
    const trimmed = editTitle.trim();
    if (!trimmed || trimmed === todo.title) {
      cancelEdit();
      return;
    }
    updateTodo.mutate({ id: todo.id, patch: { title: trimmed } }, { onSuccess: () => setEditing(false) });
  }

  function handleEditKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") cancelEdit();
    else if (e.key === "Enter") {
      e.preventDefault();
      saveEdit();
    }
  }

  function toggleCompleted() {
    const newVal: 0 | 1 = completed ? 0 : 1;
    updateTodo.mutate(
      { id: todo.id, patch: { completed: newVal } },
      { onError: () => toast.error("Failed to update todo") },
    );
  }

  function handleDelete() {
    deleteTodo.mutate(todo.id, { onError: () => toast.error("Failed to delete todo") });
  }

  return (
    <div
      className={cn(
        "group/row relative flex h-9 items-center gap-2 border-b border-muted bg-surface-lowest px-2",
        completed && "opacity-50",
      )}
    >
      <Checkbox checked={completed} onChange={toggleCompleted} label={todo.title} />

      <div className="flex min-w-0 flex-1 items-center">
        {editing ? (
          <input
            ref={inputRef}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleEditKeyDown}
            onBlur={cancelEdit}
            className="h-6 w-full border border-primary bg-transparent px-1 text-body text-primary outline-none"
          />
        ) : (
          <Button
            onClick={startEdit}
            className={cn(
              "min-w-0 flex-1 cursor-text truncate p-0 text-left text-body select-none",
              completed && "line-through",
            )}
          >
            {todo.title}
          </Button>
        )}
      </div>

      {/* Shown while the pointer is over the row, while a button in it has focus, and always on a touch screen,
          which has no hover. */}
      <div
        className={cn(
          "flex items-center gap-0.5 opacity-0 group-focus-within/row:opacity-100 group-hover/row:opacity-100",
          "motion-safe:transition-opacity motion-safe:duration-75 [@media(hover:none)]:opacity-100",
        )}
      >
        {dragHandleProps && (
          <Button variant="icon" aria-label="Drag to reorder" className="cursor-grab touch-none" {...dragHandleProps}>
            <Icon name="drag_indicator" />
          </Button>
        )}
        <Button variant="icon" onClick={onMoveUp} disabled={isFirst} title="Move up" aria-label="Move up">
          <Icon name="keyboard_arrow_up" />
        </Button>
        <Button variant="icon" onClick={onMoveDown} disabled={isLast} title="Move down" aria-label="Move down">
          <Icon name="keyboard_arrow_down" />
        </Button>
        <Button variant="icon" onClick={handleDelete} title="Delete" aria-label="Delete">
          <Icon name="delete" />
        </Button>
        {editing && (
          <Button
            variant="icon"
            onMouseDown={(e) => {
              e.preventDefault();
              saveEdit();
            }}
            title="Save (Enter)"
            aria-label="Save"
            onClick={() => {}}
          >
            <Icon name="check" />
          </Button>
        )}
      </div>
    </div>
  );
}
