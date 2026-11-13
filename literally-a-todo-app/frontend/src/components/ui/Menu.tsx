import { Menu as BaseMenu } from "@base-ui/react/menu";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import { cn } from "../../lib/cn";

type WithClass<P> = Omit<P, "className"> & { className?: string };

export interface MenuProps {
  /** The element that opens it, such as <Button variant="icon" aria-label="More actions for a task">. */
  trigger: ReactElement;
  children: ReactNode;
  align?: ComponentProps<typeof BaseMenu.Positioner>["align"];
  /** false leaves the page scrollable and clickable while the menu is open. Base UI's default is true. */
  modal?: boolean;
}

/** A menu of actions. The trigger is passed through `render`, so a Button never nests in a button. */
export function Menu({ trigger, children, align = "end", modal }: MenuProps) {
  return (
    <BaseMenu.Root modal={modal}>
      <BaseMenu.Trigger render={trigger} />
      <BaseMenu.Portal>
        <BaseMenu.Positioner align={align} sideOffset={4} collisionPadding={8} className="z-popup outline-none">
          <BaseMenu.Popup className="max-h-(--available-height) w-60 overflow-y-auto border border-primary bg-surface-lowest p-1 outline-none">
            {children}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
}

/** One action: 48 px tall, an icon at the start and the label after it. A danger item is red text, never colour alone. */
export function MenuItem({
  danger,
  className,
  ...props
}: WithClass<ComponentProps<typeof BaseMenu.Item>> & { danger?: boolean }) {
  return (
    <BaseMenu.Item
      {...props}
      className={cn(
        "flex h-12 w-full cursor-pointer items-center gap-3 px-3 text-left text-body-phone outline-0 select-none not-data-disabled:active:bg-line data-disabled:cursor-default data-disabled:text-muted data-highlighted:bg-surface-high data-highlighted:outline-2 data-highlighted:-outline-offset-2 data-highlighted:outline-primary",
        danger && "text-danger",
        className,
      )}
    />
  );
}
