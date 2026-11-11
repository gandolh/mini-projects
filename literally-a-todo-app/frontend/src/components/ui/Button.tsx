import { Button as BaseButton } from "@base-ui/react/button";
import type { CSSProperties, ReactNode } from "react";

interface Props {
  variant?: "icon" | "default";
  onClick?: () => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  children: ReactNode;
  style?: CSSProperties;
  title?: string;
  disabled?: boolean;
}

export function Button({ variant = "default", onClick, onMouseDown, children, style, title, disabled }: Props) {
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

  return (
    <BaseButton
      onClick={onClick}
      onMouseDown={onMouseDown}
      style={{ ...base, ...style }}
      title={title}
      disabled={disabled}
    >
      {children}
    </BaseButton>
  );
}
