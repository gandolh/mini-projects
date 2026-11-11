import { useEffect, useRef, useState } from "react";
import { useDrag } from "@use-gesture/react";
import { useReorderTodos, useTodos } from "../hooks/useTodos";
import type { Filter, Todo } from "../types";
import { TodoItem } from "./TodoItem";

interface Props {
  filter: Filter;
}

export function TodoList({ filter }: Props) {
  const { data: todos = [], isLoading } = useTodos();
  const reorder = useReorderTodos();
  const [items, setItems] = useState<Todo[]>([]);
  const draggingIndex = useRef<number | null>(null);

  useEffect(() => {
    setItems(todos);
  }, [todos]);

  const filtered = items.filter((t) => {
    if (filter === "active") return t.completed === 0;
    if (filter === "completed") return t.completed === 1;
    return true;
  });

  function moveItem(fromIndex: number, toIndex: number) {
    const next = [...items];
    const [moved] = next.splice(fromIndex, 1);
    if (moved === undefined) return;
    next.splice(toIndex, 0, moved);
    setItems(next);
    reorder.mutate(next.map((t) => t.id));
  }

  function moveUp(todo: Todo) {
    const idx = items.findIndex((t) => t.id === todo.id);
    if (idx <= 0) return;
    moveItem(idx, idx - 1);
  }

  function moveDown(todo: Todo) {
    const idx = items.findIndex((t) => t.id === todo.id);
    if (idx === -1 || idx >= items.length - 1) return;
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
          isFirst={i === 0}
          isLast={i === filtered.length - 1}
          onMoveUp={() => moveUp(todo)}
          onMoveDown={() => moveDown(todo)}
          draggingIndex={draggingIndex}
          onDrop={(fromIdx, toIdx) => {
            const fromTodo = filtered[fromIdx];
            const toTodo = filtered[toIdx];
            if (!fromTodo || !toTodo) return;
            const fromItemIdx = items.findIndex((t) => t.id === fromTodo.id);
            const toItemIdx = items.findIndex((t) => t.id === toTodo.id);
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
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  draggingIndex: React.MutableRefObject<number | null>;
  onDrop: (from: number, to: number) => void;
}

function DraggableTodoItem({
  todo,
  index,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  draggingIndex,
  onDrop,
}: DraggableProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const bind = useDrag(({ active, movement: [, my], last }) => {
    if (active) {
      draggingIndex.current = index;
      setIsDragging(true);
    }
    if (last) {
      setIsDragging(false);
      const ROW_HEIGHT = 36;
      const steps = Math.round(my / ROW_HEIGHT);
      if (steps !== 0 && draggingIndex.current !== null) {
        const from = draggingIndex.current;
        const to = Math.max(0, from + steps);
        if (from !== to) onDrop(from, to);
      }
      draggingIndex.current = null;
    }
  });

  const dragHandleProps = bind();

  return (
    <div
      style={{
        opacity: isDragging ? 0.4 : 1,
        background: dragOver ? "#f3f3f4" : undefined,
        transition: "opacity 0.1s",
      }}
      onDragEnter={() => setDragOver(true)}
      onDragLeave={() => setDragOver(false)}
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
