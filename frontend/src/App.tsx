import { useState } from 'react';
import { Toaster } from 'sonner';
import { FilterTabs } from './components/FilterTabs';
import { AddTodoField } from './components/AddTodoField';
import { TodoList } from './components/TodoList';
import { Separator } from './components/shared/Separator';
import type { Filter } from './types';

export function App() {
  const [filter, setFilter] = useState<Filter>('all');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f9f9f9' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          height: 36,
          background: '#fff',
          borderBottom: '1px solid #000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 8px',
          // needed for absolute-centered FilterTabs
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
          Literally a todo app
        </span>
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <FilterTabs filter={filter} onFilterChange={setFilter} />
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 16px 64px' }}>
        <div
          style={{
            width: '100%',
            maxWidth: 672,
            background: '#fff',
            border: '1px solid #000',
          }}
        >
          <Separator />
          <TodoList filter={filter} />
          <AddTodoField />
        </div>
      </main>

      <footer
        style={{
          position: 'sticky',
          bottom: 0,
          height: 36,
          background: '#fff',
          borderTop: '1px solid #000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 8px',
          fontSize: 10,
          textTransform: 'uppercase',
          opacity: 0.5,
          marginTop: 'auto',
        }}
      >
        <span>Literally a todo app</span>
      </footer>

      <Toaster position="top-center" />
    </div>
  );
}

export default App;
