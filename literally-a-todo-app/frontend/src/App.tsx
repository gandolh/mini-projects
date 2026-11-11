import { useState } from "react";
import { FilterTabs } from "./components/FilterTabs";
import { AddTodoField } from "./components/AddTodoField";
import { TodoList } from "./components/TodoList";
import { Separator } from "./components/ui/Separator";
import { Toaster } from "./components/ui/Toast";
import type { Filter } from "./types";

export function App() {
  const [filter, setFilter] = useState<Filter>("all");

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="sticky top-0 z-sticky flex h-9 items-center justify-between border-b border-primary bg-surface-lowest px-2">
        <span className="text-title font-bold tracking-[-0.02em] uppercase">Literally a todo app</span>
        {/* Centred on the page, whatever the title's width. */}
        <div className="absolute left-1/2 -translate-x-1/2">
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

      <footer className="sticky bottom-0 mt-auto flex h-9 items-center justify-between border-t border-primary bg-surface-lowest px-2 text-footer uppercase opacity-50">
        <span>Literally a todo app</span>
      </footer>

      <Toaster />
    </div>
  );
}
