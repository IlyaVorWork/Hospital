import React from "react";
import "./input.css";

export interface InputProps {
  /**
   * Type of input
   */
  type?: string;
  /**
   * Input placeholder
   */
  placeholder?: string;
  /**
   * Is option checked for input type checkbox
   */
  isChecked?: boolean;
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
  value,
  onChange,
  ...props
}: InputProps) => {
  {
    switch (type) {
      case "password":
        return (
          <div className="input">
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
              placeholder={placeholder}
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
      case "email":
        return (
          <div className="input">
            <input
              type="email"
              placeholder={placeholder}
              onChange={onChange}
              value={value}
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
      default:
        return (
          <div className="input">
            <input
              type="text"
              placeholder={placeholder}
              onChange={onChange}
              value={value}
            />
          </div>
        );
    }
  }
};

export default Input;
