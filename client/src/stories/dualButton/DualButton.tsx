import React from "react";
import "./dualButton.css";

export interface DualButtonProps {
  /**
   * Button doctor's specialization
   */
  specialization: string;
  /**
   * Button's free tickets count
   */
  ticketCount: number;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
const DualButton = ({
  specialization,
  ticketCount,
  onClick,
  ...props
}: DualButtonProps) => {
  return (
    <button className="dualButton" type="button" onClick={onClick} {...props}>
      <span>{specialization}</span>
      <span>Доступно талонов: {ticketCount}</span>
    </button>
  );
};

export default DualButton;
