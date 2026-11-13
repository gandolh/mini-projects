import { useRef, useState } from "react";
import { useDeleteTodo, useUpdateTodo } from "../hooks/useTodos";
import { cn } from "../lib/cn";
import type { Todo } from "../types";
import { Button } from "./ui/Button";
import { Checkbox } from "./ui/Checkbox";
import { toast } from "./ui/Toast";
import { Menu, MenuItem } from "./ui/Menu";
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

  // The three control sizes of a row: 40 px by default, 36 for a mouse at 1024 px and up, 48 on touch.
  const rowHeight = "min-h-10 dense:min-h-9 touch:min-h-12";
  const DragIcon = <Icon name="drag_indicator" />;

  return (
    <div
      className={cn(
        "group/row relative flex items-start px-1 text-body before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-primary before:opacity-0 focus-within:before:opacity-100 hover:before:opacity-100 touch:px-0 touch:text-body-phone",
        rowHeight,
        editing && "items-center before:opacity-100",
      )}
    >
      {/* On touch the grip sits first in the row, 44 px wide (40 under 375 px); on a mouse it is among the actions. */}
      {dragHandleProps && (
        <Button
          variant="icon"
          aria-label="Drag to reorder"
          className={cn("hidden cursor-grab touch-none text-muted touch:grid narrow:w-10", editing && "invisible")}
          {...dragHandleProps}
        >
          {DragIcon}
        </Button>
      )}

      <Checkbox checked={completed} onChange={toggleCompleted} label={todo.title} />

      <div
        className={cn(
          "group/title relative flex min-w-0 flex-1 items-center py-2 pr-2 pl-1 break-words touch:py-3 touch:pr-0 touch:pl-0 dense:py-1",
          rowHeight,
        )}
      >
        {/* While editing, the title stays in place and unseen, so the row keeps its height and the field floats over it. */}
        <span
          className={cn(
            "-mb-0.5 border-b border-dotted border-transparent pb-px group-focus-within/title:border-outline group-hover/title:border-outline",
            completed && "text-muted line-through",
            editing && "invisible",
          )}
        >
          {todo.title}
        </span>
        {editing ? (
          <input
            ref={inputRef}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleEditKeyDown}
            onBlur={cancelEdit}
            className="absolute top-1/2 right-2 left-1 h-8 -translate-y-1/2 bg-surface-lowest px-3 text-body text-on-surface outline-2 -outline-offset-2 outline-primary touch:right-1 touch:left-0 touch:h-10 touch:px-2 touch:text-body-phone"
          />
        ) : (
          <Button
            onClick={startEdit}
            aria-label={`Edit ${todo.title}`}
            className="absolute inset-0 cursor-text p-0 select-none focus-visible:-outline-offset-2"
          />
        )}
      </div>

      {/* Shown while the pointer is over the row, while a button in it has focus, and always on a touch screen,
          which has no hover. */}
      <div
        className={cn(
          "flex shrink-0 items-start opacity-0 group-focus-within/row:opacity-100 group-hover/row:opacity-100",
          "motion-safe:transition-opacity motion-safe:duration-75 touch:opacity-100",
          editing && "opacity-100",
        )}
      >
        {dragHandleProps && (
          <Button
            variant="icon"
            aria-label="Drag to reorder"
            className="cursor-grab touch-none touch:hidden"
            {...dragHandleProps}
          >
            {DragIcon}
          </Button>
        )}
        <Button
          variant="icon"
          onClick={onMoveUp}
          disabled={isFirst}
          title="Move up"
          aria-label="Move up"
          className="touch:hidden"
        >
          <Icon name="keyboard_arrow_up" />
        </Button>
        <Button
          variant="icon"
          onClick={onMoveDown}
          disabled={isLast}
          title="Move down"
          aria-label="Move down"
          className="touch:hidden"
        >
          <Icon name="keyboard_arrow_down" />
        </Button>
        <Button variant="icon" onClick={handleDelete} title="Delete" aria-label="Delete" className="touch:hidden">
          <Icon name="delete" />
        </Button>
        {editing ? (
          <Button
            variant="icon"
            onMouseDown={(e) => {
              e.preventDefault();
              saveEdit();
            }}
            title="Save (Enter)"
            aria-label="Save"
            onClick={() => {}}
            className="mr-1 size-8 border border-primary touch:mr-0 touch:size-11 dense:size-8"
          >
            <Icon name="check" />
          </Button>
        ) : (
          <Menu
            trigger={
              <Button
                variant="icon"
                aria-label={`More actions for ${todo.title}`}
                className="hidden touch:grid narrow:w-10"
              >
                <Icon name="more_vert" />
              </Button>
            }
          >
            <MenuItem onClick={onMoveUp} disabled={isFirst}>
              <Icon name="keyboard_arrow_up" />
              Move up
            </MenuItem>
            <MenuItem onClick={onMoveDown} disabled={isLast}>
              <Icon name="keyboard_arrow_down" />
              Move down
            </MenuItem>
            <MenuItem danger onClick={handleDelete}>
              <Icon name="delete" />
              Delete
            </MenuItem>
          </Menu>
        )}
      </div>
    </div>
  );
}
