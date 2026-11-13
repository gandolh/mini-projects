import { useRef, useState } from "react";
import { useCreateTodo } from "../hooks/useTodos";
import { Button } from "./ui/Button";
import { Icon } from "./Icon";

// The add row is the second pinned band: under the 48 px header and the 40 px head band on a wide screen, and at the
// top of the screen under the 60 px head band on a phone, where the title header scrolls away.
const PINNED =
  "sticky top-22 z-20 flex h-10 w-full items-center border-b border-line bg-surface-lowest max-sm:top-15 max-sm:h-[49px]";

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
        className={`${PINNED} cursor-text gap-2 px-4 text-left text-muted hover:bg-surface-low hover:text-on-surface active:bg-surface-high touch:text-body-phone`}
      >
        <Icon name="add" />
        Add a new task...
      </Button>
    );
  }

  return (
    <div className={`${PINNED} gap-2 pr-2 pl-3 max-sm:pr-1`}>
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(reset, 100)}
        className="h-8 min-w-0 flex-1 bg-surface-lowest px-3 text-body text-on-surface outline-2 -outline-offset-2 outline-primary placeholder:text-muted touch:h-11 touch:text-body-phone"
        placeholder="Add a new task..."
      />
      <Button variant="icon" onClick={save} title="Save (Enter)" aria-label="Save" className="border border-primary">
        <Icon name="check" />
      </Button>
    </div>
  );
}
