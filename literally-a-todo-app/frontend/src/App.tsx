import { useState } from "react";
import { FilterTabs } from "./components/FilterTabs";
import { ThemeSwitch } from "./components/ThemeSwitch";
import { AddTodoField } from "./components/AddTodoField";
import { TodoList } from "./components/TodoList";
import { Toaster } from "./components/ui/Toast";
import type { Filter } from "./types";

export function App() {
  const [filter, setFilter] = useState<Filter>("all");

  return (
    <div className="min-h-dvh bg-surface">
      {/* The title and, from 640 px up, the theme switch. On a phone this header scrolls away and the theme switch
          moves to its own card under the sheet. */}
      <header className="sticky top-0 z-sticky flex h-12 items-center justify-between gap-4 border-b border-line bg-surface-lowest px-6 max-sm:static max-sm:px-4">
        <h1 className="text-title whitespace-nowrap">Literally a todo app</h1>
        <div className="max-sm:hidden">
          <ThemeSwitch />
        </div>
      </header>

      <main className="mx-auto mt-4 w-full max-w-3xl px-6 pb-12 max-sm:mt-3 max-sm:px-3 max-sm:pb-6 narrow:px-1">
        <div className="border border-line bg-surface-lowest">
          {/* The head band and the add row stay pinned under the header as the list scrolls. */}
          <div className="sticky top-12 z-30 flex h-10 items-center border-b border-line bg-surface-high px-3 max-sm:top-0 max-sm:h-15 max-sm:pr-2 max-sm:pl-3 narrow:px-1">
            <div className="max-sm:flex-1">
              <FilterTabs filter={filter} onFilterChange={setFilter} />
            </div>
          </div>
          <AddTodoField />
          <TodoList filter={filter} />
        </div>

        <div className="mt-3 hidden min-h-18 items-center justify-between gap-3 border border-line bg-surface-lowest px-3 py-2 max-sm:flex">
          <ThemeSwitch />
        </div>
      </main>

      <Toaster />
    </div>
  );
}
