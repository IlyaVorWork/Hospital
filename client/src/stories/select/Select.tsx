import React from "react";
import "./select.css";
import { ReactComponent as DownArrow } from "../assets/down-arrow.svg";

export interface SelectProps {
  /**
   * Type of select value
   */
  name: string;
  /**
   * Select options
   */
  options: any[];
}

/**
 * Doctor choice component
 */
const Select = ({ name, options, ...props }: SelectProps) => {
  {
    return (
      <div className="select">
        <select name={name}>
          {options.map((el) => {
            console.log(el);
            return (
              <option id={el.id} value={el.value}>
                {el.value}
              </option>
            );
          })}
        </select>
        <DownArrow className="downArrow" />
      </div>
    );
  }
};

export default Select;
