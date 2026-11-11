import type { Filter } from "../types";
import { Button } from "./ui/Button";

interface Props {
  filter: Filter;
  onFilterChange: (f: Filter) => void;
}

const TABS: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

export function FilterTabs({ filter, onFilterChange }: Props) {
  return (
    <nav style={{ display: "flex", height: "100%" }}>
      {TABS.map((tab) => (
        <Button
          key={tab.value}
          onClick={() => onFilterChange(tab.value)}
          style={{
            height: 36,
            padding: "0 8px",
            borderBottom: filter === tab.value ? "2px solid #000" : "2px solid transparent",
            fontWeight: filter === tab.value ? 700 : 400,
            color: filter === tab.value ? "#000" : "#999",
            borderRadius: 0,
          }}
        >
          {tab.label}
        </Button>
      ))}
    </nav>
  );
}
