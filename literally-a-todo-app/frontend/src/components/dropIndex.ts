const ROW_HEIGHT = 36;

/**
 * Where a row lands when its handle is dragged `movementY` pixels: the row index it moves to, kept inside
 * the list, or null when the drag moves it no whole row.
 */
export function dropIndex(from: number, movementY: number, count: number): number | null {
  const steps = Math.round(movementY / ROW_HEIGHT);
  const to = Math.min(Math.max(from + steps, 0), count - 1);
  return to === from ? null : to;
}
