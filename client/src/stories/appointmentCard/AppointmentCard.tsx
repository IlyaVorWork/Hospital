import React from "react";
import "./appointmentCard.css";
import { ReactComponent as DownArrow } from "../assets/down-arrow.svg";
import DualTextCard from "../dualTextCard/DualTextCard";
import Button from "../button/Button";

export interface AppointmentCardProps {
  /**
   * Doctor specialization
   */
  specialization: string;
  /**
   * Doctor full name
   */
  fullName: string;
  /**
   * Doctor's photo url
   */
  url?: string;
  /**
   * Appointment date
   */
  date: string;
  /**
   * Appointment time
   */
  time: string;
  /**
   * Appointment cabinet number
   */
  cabinetNumber: number;
  /**
   * Is appointment opened
   */
  isOpened: boolean;
  /**
   * Cancel appointment button click action
   */
  onClick?: (event?: React.MouseEvent<HTMLElement>) => void;
}

/**
 * Primary UI component for user interaction
 */
const AppointmentCard = ({
  specialization,
  fullName,
  url,
  date,
  time,
  cabinetNumber,
  isOpened,
  onClick,
  ...props
}: AppointmentCardProps) => {
  let opened = isOpened ? "opened" : "";
  return (
    <div className={["appointment", opened].join(" ")}>
      <div className="miniCard">
        <span>{specialization}</span>
        <span>{date}</span>
        <DownArrow className="appointmentDownArrow" />
      </div>
      <div className="infoCard">
        <img src={url} alt="Doctor" className="doctorImg" />
        <div className="infoContainer">
          <DualTextCard leftContent="ФИО" rightContent={fullName} />
          <DualTextCard
            leftContent="Дата и время"
            rightContent={date + " | " + time}
          />
          <div className="wrapper">
            <div style={{ width: "calc(50% - 10px)", boxSizing: "border-box" }}>
              <DualTextCard
                leftContent="Кабинет"
                rightContent={cabinetNumber.toString()}
              />
            </div>
            <div style={{ width: "calc(50% - 10px)", boxSizing: "border-box" }}>
              <Button
                label="Отменить запись"
                warning={true}
                width="100%"
                onClick={onClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
