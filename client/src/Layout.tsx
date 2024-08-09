import { ReactElement, useEffect, useState } from "react";
import Header from "./stories/header/Header";
import { ButtonProps } from "./stories/button/Button";
import "./layout.css";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { redirect, useNavigate } from "react-router-dom";
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

  const [menu, setMenu] = useState<ButtonProps[]>();

  const patientMenu: ButtonProps[] = [
    {
      header: true,
      label: "Записаться на приём",
      onClick: () => {
        navigate("/appointment");
      },
    },
    {
      header: true,
      label: "Личный кабинет",
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
      onClick: () => {
        navigate("/manage/cabinets");
      },
    },
    {
      header: true,
      label: "Врачи",
      onClick: () => {
        navigate("/manage/doctors");
      },
    },
    {
      header: true,
      label: "Расписание",
      onClick: () => {
        navigate("/manage/schedule");
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
