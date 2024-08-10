import React from "react";
import "./select.css";
import { ReactComponent as DownArrow } from "../assets/down-arrow.svg";

export interface SelectOption {
  id: number;
  value: string;
}

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
  options?: SelectOption[];
  /**
   * Select onChange action
   */
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const title = (name: string) => {
  switch (name) {
    case "specialization":
      return "Выберите специализацию";
    case "time":
      return "Выберите время";
    case "cabinet":
      return "Выберите кабинет";
    case "doctor":
      return "Выберите доктора";
  }
};

/**
 * Doctor choice component
 */
const Select = ({ name, value, options, onChange, ...props }: SelectProps) => {
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
              {title(name)}
            </option>
            {options.map((el) => {
              return (
                <option key={el.id} id={el.id.toString()} value={el.value}>
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
};

export default Select;
