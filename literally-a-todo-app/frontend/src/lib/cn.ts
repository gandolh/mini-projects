import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge, told this app's @theme names (styles/index.css). Without the `text` list it reads `text-body` as a
 * colour, so `cn("text-primary", "text-body")` would drop one of the two. Keep the lists in step with @theme.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["body", "title", "footer", "icon", "tick"],
      leading: ["row"],
      font: ["mono", "icon"],
    },
    classGroups: {
      z: [{ z: ["sticky", "toast"] }],
    },
  },
});

/** Joins class names, and lets a later class win over an earlier one it conflicts with. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
