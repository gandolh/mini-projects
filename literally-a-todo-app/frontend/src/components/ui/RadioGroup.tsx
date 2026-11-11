import { Radio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { useId, type ReactNode } from "react";
import { cn } from "../../lib/cn";

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
    <div className={cn("flex flex-col gap-1.5", segmented && "h-full")}>
      {/* The label of a segmented group is for a screen reader only. */}
      <div id={labelId} className={segmented ? "sr-only" : "text-label text-muted"}>
        {label}
      </div>
      <BaseRadioGroup<Value>
        aria-labelledby={labelId}
        value={value}
        onValueChange={onValueChange}
        className={segmented ? "flex h-full" : "flex flex-col gap-2"}
      >
        {options.map((option) =>
          segmented ? (
            <Radio.Root
              key={option.value}
              value={option.value}
              className="flex h-9 cursor-pointer items-center border-b-2 border-transparent px-2 text-muted select-none data-checked:border-primary data-checked:font-bold data-checked:text-primary"
            >
              {option.label}
            </Radio.Root>
          ) : (
            <label key={option.value} className="flex items-center gap-2">
              <Radio.Root
                value={option.value}
                className="flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full border border-primary bg-surface-lowest"
              >
                <Radio.Indicator className="size-2 rounded-full bg-primary" />
              </Radio.Root>
              {option.label}
            </label>
          ),
        )}
      </BaseRadioGroup>
    </div>
  );
}
