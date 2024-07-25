import React from "react";
import "./input.css";

export interface InputProps {
  /**
   * Type of input
   */
  type: string;
  /**
   * Input placeholder
   */
  placeholder?: string;
  /**
   * Input value change handler
   */
  onChange?: () => void;
}

/**
 * Doctor choice component
 */
const Input = ({ type, placeholder, onChange, ...props }: InputProps) => {
  {
    switch (type) {
      case "password":
        return (
          <div className="input">
            <input
              type="password"
              placeholder={placeholder}
              onChange={onChange}
            />
          </div>
        );
      case "date":
        return (
          <div className="input">
            <input type="date" placeholder={placeholder} onChange={onChange} />
          </div>
        );
      case "email":
        return (
          <div className="input">
            <input type="email" placeholder={placeholder} onChange={onChange} />
          </div>
        );
      default:
        return (
          <div className="input">
            <input type="text" placeholder={placeholder} onChange={onChange} />
          </div>
        );
    }
  }
};

export default Input;
