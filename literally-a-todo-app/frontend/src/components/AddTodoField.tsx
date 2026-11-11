import { useRef, useState } from "react";
import { useCreateTodo } from "../hooks/useTodos";
import { Button } from "./ui/Button";
import { Icon } from "./Icon";

export function AddTodoField() {
  const [active, setActive] = useState(false);
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const createTodo = useCreateTodo();

  function activate() {
    setActive(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function reset() {
    setActive(false);
    setTitle("");
  }

  function save() {
    const trimmed = title.trim();
    if (!trimmed) return;
    createTodo.mutate(trimmed, { onSuccess: reset });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      reset();
    } else if (e.key === "Enter") {
      e.preventDefault();
      save();
    }
  }

  if (!active) {
    return (
      <Button
        onClick={activate}
        style={{
          width: "100%",
          height: 36,
          padding: "0 8px",
          display: "flex",
          alignItems: "center",
          textAlign: "left",
          lineHeight: "inherit",
          cursor: "text",
          color: "#999",
          fontSize: 14,
          borderTop: "1px solid #999",
        }}
      >
        Add a new task...
      </Button>
    );
  }

  return (
    <div
      style={{
        height: 36,
        padding: "0 8px",
        display: "flex",
        alignItems: "center",
        gap: 4,
        borderTop: "1px solid #000",
      }}
    >
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(reset, 100)}
        style={{
          flex: 1,
          height: "100%",
          border: "none",
          outline: "none",
          background: "transparent",
          fontFamily: "inherit",
          fontSize: 14,
          color: "#000",
        }}
        placeholder="Add a new task..."
      />
      <Button variant="icon" onClick={save} title="Save (Enter)" aria-label="Save">
        <Icon name="check" />
      </Button>
    </div>
  );
}
