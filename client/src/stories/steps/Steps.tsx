import React from "react";
import "./steps.css";
import { ReactComponent as Arrow } from "../assets/arrow.svg";

export interface StepsProps {
  /**
   * Active step number
   */
  activeStep: number;
}

/**
 * Primary UI component for user interaction
 */
const Button = ({ activeStep, ...props }: StepsProps) => {
  const isFirstActive = activeStep === 1 ? "activeStep" : "";
  const isSecondActive = activeStep === 2 ? "activeStep" : "";
  const isThirdActive = activeStep === 3 ? "activeStep" : "";
  return (
    <div className="steps">
      <div className={isFirstActive}>
        <span className="step">1</span>
        <span className="stepText">Выбор специализации</span>
      </div>
      <Arrow className="arrow" />
      <div className={isSecondActive}>
        <span className="step">2</span>
        <span className="stepText">Выбор врача</span>
      </div>
      <Arrow className="arrow" />
      <div className={isThirdActive}>
        <span className="step">3</span>
        <span className="stepText">Выбор записи</span>
      </div>
    </div>
  );
};

export default Button;
