import React from "react";
import "./button.css";

export interface ButtonProps {
  /**
   * Is button showing current page?
   */
  active?: boolean;
  /**
   * Is button located in header?
   */
  header?: boolean;
  /**
   * Is button doing dangerous action?
   */
  warning?: boolean;
  /**
   * Button width
   */
  width?: string;
  /**
   * Button contents
   */
  label: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
const Button = ({
  active = false,
  header = false,
  warning = false,
  label,
  width,
  onClick,
  ...props
}: ButtonProps) => {
  const isActive = active ? "active" : "";
  const isHeader = header ? "inHeader" : "";
  const isWarning = warning ? "warning" : "";
  return (
    <button
      type="button"
      className={["button", isActive, isHeader, isWarning].join(" ")}
      style={{ width: width }}
      onClick={onClick}
      {...props}>
      {label}
    </button>
  );
};

export default Button;
