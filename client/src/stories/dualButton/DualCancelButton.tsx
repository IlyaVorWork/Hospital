import React from "react";
import "./dualButton.css";

export interface DualCancelButtonProps {
  /**
   * Button choice text
   */
  choice: string;
  /**
   * Choice cancellation function
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
const DualCancelButton = ({
  choice,
  onClick,
  ...props
}: DualCancelButtonProps) => {
  return (
    <button
      className="dualButton cancellation"
      type="button"
      onClick={onClick}
      {...props}>
      <span>{choice}</span>
      <span className="choiceCancellation" onClick={onClick}>
        Отмена
      </span>
    </button>
  );
};

export default DualCancelButton;
