import React from "react";
import "./dualTextCard.css";

export interface DualTextCardProps {
  /**
   * Left part content of a card
   */
  leftContent: string;
  /**
   * Right part content of a card
   */
  rightContent: string;
}

/**
 * Primary UI component for user interaction
 */
const DualTextCard = ({
  leftContent,
  rightContent,
  ...props
}: DualTextCardProps) => {
  return (
    <div className="dualTextCard" {...props}>
      <span>{leftContent}</span>
      <span>{rightContent}</span>
    </div>
  );
};

export default DualTextCard;
