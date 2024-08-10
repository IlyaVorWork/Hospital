import { ReactElement, useEffect, useState } from "react";
import Header from "./stories/header/Header";
import { ButtonProps } from "./stories/button/Button";
import "./layout.css";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { redirect, useLocation, useNavigate } from "react-router-dom";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

interface LayoutProps {
  children: ReactElement;
}

interface IMenuMap {
  patient: ButtonProps[];
  admin: ButtonProps[];
}

type role = "admin" | "patient";

export type AccessTokenPayload = {
  exp: number;
  id: number;
  login: role;
  role: string;
};

const Layout = ({ children, ...props }: LayoutProps) => {
  const [accessToken, _, removeAcccessToken] = useCookies(["Access_token"]);
  const navigate = useNavigate();
  const location = useLocation();

  let currentPath = location.pathname.split("/").pop();

  const [menu, setMenu] = useState<ButtonProps[]>();

  const patientMenu: ButtonProps[] = [
    {
      header: true,
      label: "Записаться на приём",
      active: currentPath === "makeAppointment",
      onClick: () => {
        navigate("/makeAppointment");
      },
    },
    {
      header: true,
      label: "Личный кабинет",
      active: currentPath === "profile",
      onClick: () => {
        navigate("/profile");
      },
    },
    {
      header: true,
      label: "Выход",
      onClick: () => {
        removeAcccessToken("Access_token");
        navigate("/login");
      },
    },
  ];

  const adminMenu: ButtonProps[] = [
    {
      header: true,
      label: "Кабинеты",
      active: currentPath === "cabinets",
      onClick: () => {
        navigate("/cabinets");
      },
    },
    {
      header: true,
      label: "Врачи",
      active: currentPath === "doctors",
      onClick: () => {
        navigate("/doctors");
      },
    },
    {
      header: true,
      label: "Расписание",
      active: currentPath === "schedule",
      onClick: () => {
        navigate("/schedule");
      },
    },
    {
      header: true,
      label: "Записи",
      active: currentPath === "appointments",
      onClick: () => {
        navigate("/appointments");
      },
    },
    {
      header: true,
      label: "Выход",
      onClick: () => {
        removeAcccessToken("Access_token");
        navigate("/login");
      },
    },
  ];

  const headerButtons: IMenuMap = {
    patient: patientMenu,
    admin: adminMenu,
  };

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
    <>
      <ReactNotifications />
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
    </>
  );
};

export default Layout;
