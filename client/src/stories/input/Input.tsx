import React from "react";
import "./input.css";

type InputType = "text" | "date" | "password" | "checkbox";

export interface InputProps {
  /**
   * Type of input
   */
  type: InputType;
  /**
   * Input placeholder
   */
  placeholder?: string;
  /**
   * Is option checked for input type checkbox
   */
  isChecked?: boolean;
  /**
   * Is input invalid?
   */
  invalid?: boolean;
  /**
   * Input value
   */
  value?: any;
  /**
   * Input value change handler
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Doctor choice component
 */
const Input = ({
  type,
  placeholder,
  isChecked,
  invalid,
  value,
  onChange,
  ...props
}: InputProps) => {
  let isInvalid = invalid ? "invalid" : "";
  switch (type) {
    case "password":
      return (
        <div className={["input", isInvalid].join(" ")}>
          <input
            type="password"
            placeholder={placeholder}
            onChange={onChange}
            value={value}
          />
        </div>
      );
    case "date":
      return (
        <div className="input">
          <input
            type="date"
            onChange={onChange}
            value={
              value && typeof value != "string"
                ? value?.toISOString().split("T")[0]
                : ""
            }
            //min={new Date().toISOString().split("T")[0]}
          />
        </div>
      );
    case "checkbox":
      return (
        <div className="input">
          <div className="checkbox">
            <input
              type="checkbox"
              value={value}
              name={value}
              checked={isChecked}
              onChange={onChange}
            />
            <label htmlFor={value}>{placeholder}</label>
          </div>
        </div>
      );
    case "text":
      return (
        <div className={["input", isInvalid].join(" ")}>
          <input
            type="text"
            placeholder={placeholder}
            onChange={onChange}
            value={value}
          />
        </div>
      );
  }
};

export default Input;
