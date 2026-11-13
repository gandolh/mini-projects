import { setTheme, useTheme } from "../lib/theme";
import { RadioGroup } from "./ui/RadioGroup";

const THEMES = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;

/** Light, Dark or System, kept on this device. A RadioGroup: nothing goes to the server (base-ui rule 16). */
export function ThemeSwitch() {
  return (
    <RadioGroup
      label="Theme"
      look="segmented"
      chosen="frame"
      options={THEMES}
      value={useTheme()}
      onValueChange={setTheme}
    />
  );
}
