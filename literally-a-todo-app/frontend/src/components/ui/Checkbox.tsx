import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";

interface Props {
  checked: boolean;
  onChange: () => void;
}

export function Checkbox({ checked, onChange }: Props) {
  return (
    <BaseCheckbox.Root
      checked={checked}
      onCheckedChange={onChange}
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
        {checked && (
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 14,
              color: "#fff",
              fontVariationSettings: '"FILL" 1',
              lineHeight: 1,
            }}
          >
            check
          </span>
        )}
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
}
