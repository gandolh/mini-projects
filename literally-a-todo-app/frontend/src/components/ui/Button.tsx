import { Button as BaseButton } from "@base-ui/react/button";
import type { ComponentProps, CSSProperties } from "react";

type Props = Omit<ComponentProps<typeof BaseButton>, "style"> & {
  variant?: "icon" | "default";
  style?: CSSProperties;
};

/** Base UI's Button with the app's two looks. It passes every other prop on, `ref` and handlers included. */
export function Button({ variant = "default", style, disabled, ...rest }: Props) {
  const base: CSSProperties =
    variant === "icon"
      ? {
          background: "none",
          border: "none",
          cursor: disabled ? "default" : "pointer",
          padding: 0,
          width: 20,
          height: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: disabled ? "#999" : "#000",
          flexShrink: 0,
        }
      : {
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0 8px",
          fontFamily: "inherit",
          fontSize: "inherit",
          color: "inherit",
          borderRadius: 0,
        };

  return <BaseButton {...rest} disabled={disabled} style={{ ...base, ...style }} />;
}
