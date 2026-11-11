import { useRef, useState } from "react";
import { toast } from "sonner";
import { useDeleteTodo, useUpdateTodo } from "../hooks/useTodos";
import type { Todo } from "../types";
import { Button } from "./ui/Button";
import { Checkbox } from "./ui/Checkbox";
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
      style={{
        height: 36,
        padding: "0 8px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        borderBottom: "1px solid #999",
        opacity: completed ? 0.5 : 1,
        background: "#fff",
        position: "relative",
      }}
      className="todo-row"
    >
      <Checkbox checked={completed} onChange={toggleCompleted} label={todo.title} />

      <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center" }}>
        {editing ? (
          <input
            ref={inputRef}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleEditKeyDown}
            onBlur={cancelEdit}
            style={{
              width: "100%",
              border: "1px solid #000",
              outline: "none",
              background: "transparent",
              fontFamily: "inherit",
              fontSize: 14,
              color: "#000",
              height: 24,
              padding: "0 4px",
            }}
          />
        ) : (
          <span
            onClick={startEdit}
            style={{
              fontSize: 14,
              cursor: "text",
              textDecoration: completed ? "line-through" : "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
              userSelect: "none",
            }}
          >
            {todo.title}
          </span>
        )}
      </div>

      <div className="todo-actions" style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {dragHandleProps && (
          <Button variant="icon" aria-label="Drag to reorder" style={{ cursor: "grab" }} {...dragHandleProps}>
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
