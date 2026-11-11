import { useState } from "react";
import { FilterTabs } from "./components/FilterTabs";
import { ThemeSwitch } from "./components/ThemeSwitch";
import { AddTodoField } from "./components/AddTodoField";
import { TodoList } from "./components/TodoList";
import { Separator } from "./components/ui/Separator";
import { Toaster } from "./components/ui/Toast";
import type { Filter } from "./types";

export function App() {
  const [filter, setFilter] = useState<Filter>("all");

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      {/* On a phone the title and the tabs don't fit on one row, so the tabs take a row of their own. */}
      <header className="sticky top-0 z-sticky flex h-9 items-center justify-between border-b border-primary bg-surface-lowest px-2 max-sm:h-auto max-sm:flex-col max-sm:items-stretch">
        <span className="flex h-9 items-center text-title font-bold tracking-[-0.02em] uppercase">
          Literally a todo app
        </span>
        {/* Centred on the page, whatever the title's width. */}
        <div className="absolute left-1/2 -translate-x-1/2 max-sm:static max-sm:translate-x-0 max-sm:self-center">
          <FilterTabs filter={filter} onFilterChange={setFilter} />
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center px-4 pt-8 pb-16">
        <div className="w-full max-w-2xl border border-primary bg-surface-lowest">
          <Separator />
          <TodoList filter={filter} />
          <AddTodoField />
        </div>
      </main>

      {/* The footer's text is faded; the theme switch is a control, so it keeps full contrast like the header's tabs. */}
      <footer className="sticky bottom-0 mt-auto flex h-9 items-center justify-between border-t border-primary/50 bg-surface-lowest px-2 text-footer uppercase">
        <span className="opacity-50">Literally a todo app</span>
        <ThemeSwitch />
      </footer>

      <Toaster />
    </div>
  );
}
