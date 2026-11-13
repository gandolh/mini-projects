import type { Filter } from "../types";
import { RadioGroup } from "./ui/RadioGroup";

interface Props {
  filter: Filter;
  onFilterChange: (f: Filter) => void;
}

const TABS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
] as const;

/** Which tasks the list shows. Nothing is saved, so the arrow keys may choose (base-ui rule 16). */
export function FilterTabs({ filter, onFilterChange }: Props) {
  return (
    <RadioGroup label="Show" look="segmented" stretch options={TABS} value={filter} onValueChange={onFilterChange} />
  );
}
