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
        className="flex h-9 w-full cursor-text items-center border-t border-muted px-2 text-left text-body text-muted"
      >
        Add a new task...
      </Button>
    );
  }

  return (
    <div className="flex h-9 items-center gap-1 border-t border-primary px-2">
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(reset, 100)}
        className="h-full flex-1 bg-transparent text-body text-primary outline-none placeholder:text-muted"
        placeholder="Add a new task..."
      />
      <Button variant="icon" onClick={save} title="Save (Enter)" aria-label="Save">
        <Icon name="check" />
      </Button>
    </div>
  );
}
