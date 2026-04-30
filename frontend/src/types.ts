export interface Todo {
  id: number;
  title: string;
  completed: 0 | 1;
  position: number;
}

export type Filter = 'all' | 'active' | 'completed';
