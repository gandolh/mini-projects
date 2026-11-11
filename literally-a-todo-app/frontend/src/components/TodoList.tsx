import { useRef, useState } from "react";
import { useDrag } from "@use-gesture/react";
import { useReorderTodos, useTodos } from "../hooks/useTodos";
import type { Filter, Todo } from "../types";
import { dropIndex } from "./dropIndex";
import { TodoItem } from "./TodoItem";

interface Props {
  filter: Filter;
}

export function TodoList({ filter }: Props) {
  const { data: todos = [], isLoading } = useTodos();
  const reorder = useReorderTodos();

  // The list on screen is the query's: useReorderTodos updates it before the server answers.
  const filtered = todos.filter((t) => {
    if (filter === "active") return t.completed === 0;
    if (filter === "completed") return t.completed === 1;
    return true;
  });

  function moveItem(fromIndex: number, toIndex: number) {
    const next = [...todos];
    const [moved] = next.splice(fromIndex, 1);
    if (moved === undefined) return;
    next.splice(toIndex, 0, moved);
    reorder.mutate(next.map((t) => t.id));
  }

  function moveUp(todo: Todo) {
    const idx = todos.findIndex((t) => t.id === todo.id);
    if (idx <= 0) return;
    moveItem(idx, idx - 1);
  }

  function moveDown(todo: Todo) {
    const idx = todos.findIndex((t) => t.id === todo.id);
    if (idx === -1 || idx >= todos.length - 1) return;
    moveItem(idx, idx + 1);
  }

  if (isLoading) {
    return (
      <div style={{ height: 36, padding: "0 8px", display: "flex", alignItems: "center", color: "#999", fontSize: 14 }}>
        Loading...
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div style={{ height: 36, padding: "0 8px", display: "flex", alignItems: "center", color: "#999", fontSize: 14 }}>
        No tasks.
      </div>
    );
  }

  return (
    <div>
      {filtered.map((todo, i) => (
        <DraggableTodoItem
          key={todo.id}
          todo={todo}
          index={i}
          count={filtered.length}
          isFirst={i === 0}
          isLast={i === filtered.length - 1}
          onMoveUp={() => moveUp(todo)}
          onMoveDown={() => moveDown(todo)}
          onDrop={(fromIdx, toIdx) => {
            const fromTodo = filtered[fromIdx];
            const toTodo = filtered[toIdx];
            if (!fromTodo || !toTodo) return;
            const fromItemIdx = todos.findIndex((t) => t.id === fromTodo.id);
            const toItemIdx = todos.findIndex((t) => t.id === toTodo.id);
            moveItem(fromItemIdx, toItemIdx);
          }}
        />
      ))}
    </div>
  );
}

interface DraggableProps {
  todo: Todo;
  index: number;
  count: number;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDrop: (from: number, to: number) => void;
}

function DraggableTodoItem({ todo, index, count, isFirst, isLast, onMoveUp, onMoveDown, onDrop }: DraggableProps) {
  const [isDragging, setIsDragging] = useState(false);
  const draggingIndex = useRef<number | null>(null);

  const bind = useDrag(({ active, movement: [, my], last }) => {
    if (active) {
      draggingIndex.current = index;
      setIsDragging(true);
    }
    if (last) {
      setIsDragging(false);
      if (draggingIndex.current !== null) {
        const from = draggingIndex.current;
        const to = dropIndex(from, my, count);
        if (to !== null) onDrop(from, to);
      }
      draggingIndex.current = null;
    }
  });

  const dragHandleProps = bind();

  return (
    <div
      style={{
        opacity: isDragging ? 0.4 : 1,
        transition: "opacity 0.1s",
      }}
    >
      <TodoItem
        todo={todo}
        dragHandleProps={dragHandleProps}
        isFirst={isFirst}
        isLast={isLast}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
      />
    </div>
  );
}
