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
      style={{
        width: 16,
        height: 16,
        border: "1px solid #000",
        borderRadius: 0,
        background: checked ? "#000" : "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <BaseCheckbox.Indicator>
        <Icon name="check" className="text-tick text-surface-lowest [font-variation-settings:'FILL'_1]" />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
}
