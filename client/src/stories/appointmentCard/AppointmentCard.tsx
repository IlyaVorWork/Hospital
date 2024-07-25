import React, { useState } from "react";
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
  ...props
}: AppointmentCardProps) => {
  const [isOpened, setOpened] = useState("");
  const changeVisibility = () => {
    isOpened == "" ? setOpened("opened") : setOpened("");
  };

  return (
    <div className={["appointment", isOpened].join(" ")}>
      <div className="miniCard" onClick={changeVisibility}>
        <span>{specialization}</span>
        <span>{date}</span>
        <DownArrow className="appointmentDownArrow" />
      </div>
      <div className="infoCard">
        <img src={url} alt="Doctor's photo" className="doctorImg" />
        <div className="infoContainer">
          <DualTextCard leftContent="ФИО" rightContent={fullName} />
          <DualTextCard
            leftContent="Дата и время"
            rightContent={date + "|" + time}
          />
          <div className="wrapper">
            <div style={{ width: "calc(50% - 10px)", boxSizing: "border-box" }}>
              <DualTextCard
                leftContent="Кабинет"
                rightContent={cabinetNumber.toString()}
              />
            </div>
            <div style={{ width: "calc(50% - 10px)", boxSizing: "border-box" }}>
              <Button label="Отменить запись" warning={true} width="100%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
