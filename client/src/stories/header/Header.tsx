import React from "react";
import "./header.css";
import { ButtonProps } from "../button/Button";
import Button from "../button/Button";
import { ReactComponent as Logo } from "../assets/logo.svg";

export interface HeaderProps {
  /**
   * Buttons of header
   */
  menu?: ButtonProps[];
}

/**
 * Header of a site
 */
const Header = ({ menu, ...props }: HeaderProps) => {
  return (
    <div className="header">
      <div className="brand">
        <Logo className="logo" />
        <span className="logoText">Муниципальная больница</span>
      </div>
      <div className="buttonGroup">
        {menu?.map(({ active, header, warning, width, label, onClick }) => {
          return (
            <Button
              key={label}
              active={active}
              header={header}
              warning={warning}
              width={width}
              label={label}
              onClick={onClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Header;
