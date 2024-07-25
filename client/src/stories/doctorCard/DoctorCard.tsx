import React from "react";
import "./doctorCard.css";

export interface DoctorCardProps {
  /**
   * Full name of the doctor
   */
  doctorName: string;
  /**
   * Card's free tickets count
   */
  ticketCount: number;
  /**
   * Doctor's photo url
   */
  url?: string;
  /**
   * Choice click handler
   */
  onClick?: () => void;
}

/**
 * Doctor choice component
 */
const DoctorCard = ({
  doctorName,
  ticketCount,
  url,
  onClick,
  ...props
}: DoctorCardProps) => {
  return (
    <div className="card">
      <img src={url} alt="Doctor's photo" className="doctorImg" />
      <span>{doctorName}</span>
      <span>Талонов: {ticketCount}</span>
    </div>
  );
};

export default DoctorCard;
