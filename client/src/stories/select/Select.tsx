import React, { useEffect, useState } from "react";
import "./select.css";
import { ReactComponent as DownArrow } from "../assets/down-arrow.svg";

export interface SelectProps {
  /**
   * Type of select value
   */
  name: string;
  /**
   * Selected value
   */
  value?: any;
  /**
   * Select options
   */
  options?: any[];
  /**
   * Select onChange action
   */
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

/**
 * Doctor choice component
 */
const Select = ({ name, value, options, onChange, ...props }: SelectProps) => {
  {
    return (
      <div className="select">
        <select
          name={name}
          onChange={(event) => {
            onChange(event);
          }}
          value={value}>
          {options && options.length > 0 ? (
            <>
              <option value="" disabled>
                Выберите время
              </option>
              {options.map((el) => {
                return (
                  <option key={el.id} id={el.id} value={el.value}>
                    {el.value}
                  </option>
                );
              })}
            </>
          ) : (
            <option value="" disabled>
              Нет данных
            </option>
          )}
        </select>
        <DownArrow className="downArrow" />
      </div>
    );
  }
};

export default Select;
