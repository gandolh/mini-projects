const ROW_HEIGHT = 36;

/**
 * Where a row lands when its handle is dragged `movementY` pixels: the row index it moves to, kept inside
 * the list, or null when the drag moves it no whole row. `rowHeight` is the dragged row's height on screen (36 px
 * for a mouse at 1024 px and up, 40 or 48 elsewhere).
 */
export function dropIndex(from: number, movementY: number, count: number, rowHeight = ROW_HEIGHT): number | null {
  const steps = Math.round(movementY / rowHeight);
  const to = Math.min(Math.max(from + steps, 0), count - 1);
  return to === from ? null : to;
}
