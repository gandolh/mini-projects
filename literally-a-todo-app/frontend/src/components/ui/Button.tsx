import { Button as BaseButton } from "@base-ui/react/button";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

const VARIANTS = {
  /** A 20 px glyph button: black, grey while disabled. */
  icon: "flex size-5 shrink-0 cursor-pointer items-center justify-center text-primary data-disabled:cursor-default data-disabled:text-muted",
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
