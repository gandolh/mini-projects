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
  /** `list` stacks radios with dots; `segmented` draws a label and one row of buttons, for a filter or a setting. */
  look?: "list" | "segmented";
  /** How a segmented group marks its choice: `fill` is a solid ink block (the filter), `frame` a 2 px ink frame. */
  chosen?: "fill" | "frame";
  /** Under 640 px, the buttons share the row's width (the filter in the sheet's head band). */
  stretch?: boolean;
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
  chosen = "fill",
  stretch = false,
}: RadioGroupProps<Value>) {
  const labelId = useId();
  const segmented = look === "segmented";
  return (
    <div
      className={cn(
        segmented ? "flex items-center gap-3" : "flex flex-col gap-1.5",
        segmented && stretch && "max-sm:flex-1",
      )}
    >
      <div id={labelId} className="text-label text-muted">
        {label}
      </div>
      <BaseRadioGroup<Value>
        aria-labelledby={labelId}
        value={value}
        onValueChange={onValueChange}
        className={
          segmented ? cn("flex min-w-0 border border-outline", stretch && "max-sm:flex-1") : "flex flex-col gap-2"
        }
      >
        {options.map((option) =>
          segmented ? (
            <Radio.Root
              key={option.value}
              value={option.value}
              className={cn(
                "relative flex h-8 min-w-18 cursor-pointer items-center justify-center border-l border-outline px-3 text-label select-none first:border-l-0 focus-visible:z-10 active:bg-line data-checked:font-bold max-sm:h-12 max-sm:min-w-0 max-sm:px-3 max-sm:text-[0.875rem]/5",
                stretch && "max-sm:flex-1 max-sm:px-1",
                chosen === "fill"
                  ? "data-checked:bg-primary data-checked:text-on-primary"
                  : "data-checked:bg-surface-lowest data-checked:ring-2 data-checked:ring-primary data-checked:ring-inset",
              )}
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
