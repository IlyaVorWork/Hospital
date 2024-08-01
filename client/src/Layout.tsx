import { ReactElement, useEffect, useState } from "react";
import Header from "./stories/header/Header";
import { ButtonProps } from "./stories/button/Button";
import "./layout.css";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";

interface LayoutProps {
  children: ReactElement;
}

interface IMenuMap {
  patient: ButtonProps[];
  admin: ButtonProps[];
}

type role = "admin" | "patient";

type AccessTokenPayload = {
  exp: number;
  id: number;
  login: role;
  role: string;
};

const patientMenu: ButtonProps[] = [
  {
    header: true,
    label: "Записаться на приём",
  },
  {
    header: true,
    label: "Личный кабинет",
  },
  {
    header: true,
    label: "Выход",
  },
];

const adminMenu: ButtonProps[] = [
  {
    header: true,
    label: "Кабинеты",
  },
  {
    header: true,
    label: "Врачи",
  },
  {
    header: true,
    label: "Расписание",
  },
  {
    header: true,
    label: "Выход",
  },
];

const headerButtons: IMenuMap = {
  patient: patientMenu,
  admin: adminMenu,
};

const Layout = ({ children, ...props }: LayoutProps) => {
  const [accessToken] = useCookies(["Access_token"]);

  const [menu, setMenu] = useState<ButtonProps[]>();

  useEffect(() => {
    if (accessToken.Access_token) {
      const decodedToken: AccessTokenPayload = jwtDecode(
        accessToken.Access_token
      );
      if (decodedToken.role === "admin") {
        setMenu(headerButtons.admin);
      } else {
        setMenu(headerButtons.patient);
      }
    }
  }, []);

  return (
    <div className="layout">
      <Header menu={menu} />
      <div className="auth"> {children}</div>
      <div
        style={{
          width: "100%",
          height: "56px",
          backgroundColor: "black",
        }}></div>
    </div>
  );
};

export default Layout;
