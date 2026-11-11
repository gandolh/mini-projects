import { Radio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { useId, type CSSProperties, type ReactNode } from "react";

interface RadioOption<Value extends string> {
  value: Value;
  label: ReactNode;
}

export interface RadioGroupProps<Value extends string> {
  label: ReactNode;
  options: readonly RadioOption<Value>[];
  value: Value;
  onValueChange: (value: Value) => void;
  /** `list` stacks radios with dots; `segmented` draws one row of tab-like buttons, for a filter. */
  look?: "list" | "segmented";
}

// The label of a segmented group is for a screen reader only.
const visuallyHidden: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
};

/**
 * One choice from a few. Tab enters the group, and arrow keys move and choose (base-ui rule 16): for a
 * filter, and for a setting kept on the device.
 */
export function RadioGroup<Value extends string>({
  label,
  options,
  value,
  onValueChange,
  look = "list",
}: RadioGroupProps<Value>) {
  const labelId = useId();
  const segmented = look === "segmented";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, height: segmented ? "100%" : undefined }}>
      <div id={labelId} style={segmented ? visuallyHidden : { fontSize: 12, color: "#999" }}>
        {label}
      </div>
      <BaseRadioGroup<Value>
        aria-labelledby={labelId}
        value={value}
        onValueChange={onValueChange}
        style={segmented ? { display: "flex", height: "100%" } : { display: "flex", flexDirection: "column", gap: 8 }}
      >
        {options.map((option) =>
          segmented ? (
            <Radio.Root
              key={option.value}
              value={option.value}
              style={(state) => ({
                display: "flex",
                alignItems: "center",
                height: 36,
                padding: "0 8px",
                cursor: "pointer",
                userSelect: "none",
                borderBottom: state.checked ? "2px solid #000" : "2px solid transparent",
                fontWeight: state.checked ? 700 : 400,
                color: state.checked ? "#000" : "#999",
              })}
            >
              {option.label}
            </Radio.Root>
          ) : (
            <label key={option.value} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Radio.Root
                value={option.value}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 16,
                  height: 16,
                  border: "1px solid #000",
                  borderRadius: "50%",
                  background: "#fff",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <Radio.Indicator style={{ width: 8, height: 8, borderRadius: "50%", background: "#000" }} />
              </Radio.Root>
              {option.label}
            </label>
          ),
        )}
      </BaseRadioGroup>
    </div>
  );
}
