import { Button as BaseButton } from "@base-ui/react/button";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

const VARIANTS = {
  /** A glyph button: 40 px square (36 for a mouse at 1024 px and up, 44 by 48 on touch), ink, muted while disabled. */
  icon: "grid size-10 shrink-0 cursor-pointer place-items-center text-primary not-data-disabled:hover:bg-line not-data-disabled:active:bg-primary not-data-disabled:active:text-on-primary data-disabled:cursor-default data-disabled:text-muted dense:size-9 touch:h-12 touch:w-11",
  /** A text button with the row's 8 px padding. */
  default: "cursor-pointer px-2",
} as const;

type Props = Omit<ComponentProps<typeof BaseButton>, "className"> & {
  variant?: keyof typeof VARIANTS;
  /** Merged last through cn(), so a caller's class wins over the variant's. */
  className?: string;
};

/** Base UI's Button with the app's two looks. It passes every other prop on, `ref` and handlers included. */
export function Button({ variant = "default", className, ...rest }: Props) {
  return <BaseButton {...rest} className={cn(VARIANTS[variant], className)} />;
}
