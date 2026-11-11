import type { CSSProperties } from "react";

interface Props {
  /** The Material Symbols ligature, such as `keyboard_arrow_up`. */
  name: string;
  size?: number;
  style?: CSSProperties;
}

/** A glyph is a ligature word, so it is hidden from a screen reader: the control around it carries the name. */
export function Icon({ name, size = 20, style }: Props) {
  return (
    <span aria-hidden="true" className="material-symbols-outlined" style={{ fontSize: size, ...style }}>
      {name}
    </span>
  );
}
