import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge, told this app's @theme names (styles/index.css). Without the `text` list it reads `text-body` as a
 * colour, so `cn("text-primary", "text-body")` would drop one of the two. Keep the lists in step with @theme.
 *
 * The glyph sizes carry no line height, and a text size's own line height is meant to be overridden, so a
 * size must not remove a `leading-*`, which tailwind-merge does by default: `cn("leading-none", "text-tick")` would lose the `leading-none`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["body", "body-phone", "title", "footer", "label", "icon", "tick"],
      font: ["mono", "icon"],
    },
    classGroups: {
      z: [{ z: ["sticky", "popup", "toast"] }],
    },
  },
  override: {
    conflictingClassGroups: { "font-size": [] },
  },
});

/** Joins class names, and lets a later class win over an earlier one it conflicts with. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
