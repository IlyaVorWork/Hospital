import React from "react";
import "./infoCard.css";

interface infoCardProps {
  text: string;
  type?: string;
}

const InfoCard = ({ text, type }: infoCardProps) => {
  return <div className={["info", type].join(" ")}>{text}</div>;
};

export default InfoCard;
