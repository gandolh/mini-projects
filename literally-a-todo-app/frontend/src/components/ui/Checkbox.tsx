import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Icon } from "../Icon";

interface Props {
  checked: boolean;
  onChange: () => void;
  /** The checkbox's accessible name: what ticking it does, such as the task's title. */
  label: string;
}

export function Checkbox({ checked, onChange, label }: Props) {
  return (
    <BaseCheckbox.Root
      checked={checked}
      onCheckedChange={onChange}
      aria-label={label}
      className="flex size-4 shrink-0 cursor-pointer items-center justify-center border border-primary bg-surface-lowest data-checked:bg-primary"
    >
      <BaseCheckbox.Indicator>
        <Icon name="check" className="text-tick text-surface-lowest [font-variation-settings:'FILL'_1]" />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
}
