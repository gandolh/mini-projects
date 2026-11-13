import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Icon } from "../Icon";

interface Props {
  checked: boolean;
  onChange: () => void;
  /** The checkbox's accessible name: what ticking it does, such as the task's title. */
  label: string;
}

/**
 * An 18 px box. Its margin and a pseudo-element make the row's hit target: 40 px square, 36 for a mouse at 1024 px
 * and up, 44 by 48 on touch. The root is the box itself, so the focus ring sits on the box.
 */
export function Checkbox({ checked, onChange, label }: Props) {
  return (
    <BaseCheckbox.Root
      checked={checked}
      onCheckedChange={onChange}
      aria-label={label}
      className="relative m-[11px] grid size-[18px] shrink-0 cursor-pointer place-items-center border border-outline bg-surface-lowest before:absolute before:-inset-[11px] data-checked:border-primary data-checked:bg-primary touch:mx-[13px] touch:my-[15px] touch:before:-inset-x-[13px] touch:before:-inset-y-[15px] dense:m-[9px] dense:before:-inset-[9px]"
    >
      <BaseCheckbox.Indicator className="grid place-items-center">
        <Icon name="check" className="text-tick text-on-primary [font-variation-settings:'FILL'_1]" />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
}
