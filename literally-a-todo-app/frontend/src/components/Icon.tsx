import { cn } from "../lib/cn";

interface Props {
  /** The Material Symbols ligature, such as `keyboard_arrow_up`. */
  name: string;
  /** Classes merged over the glyph's own: another size (`text-tick`), a colour, a fill. */
  className?: string;
}

/**
 * A glyph is a ligature word, so it is hidden from a screen reader: the control around it carries the name. Its box
 * is one em square and clips, so while the icon font loads, or if it never does, the word can't spill over the next
 * button.
 */
export function Icon({ name, className }: Props) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block size-[1em] overflow-hidden font-icon [font-feature-settings:'liga'] text-icon leading-none font-normal tracking-normal whitespace-nowrap normal-case not-italic antialiased [direction:ltr]",
        className,
      )}
    >
      {name}
    </span>
  );
}
