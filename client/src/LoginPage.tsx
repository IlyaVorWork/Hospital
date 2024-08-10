import React, { useState } from "react";
import Layout from "./Layout";
import Input from "./stories/input/Input";
import Button from "./stories/button/Button";
import { useMutation } from "react-query";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { Store } from "react-notifications-component";

type role = "patient" | "admin";

type loginData = {
  role: string;
  login: string;
  password: string;
};

export interface tokenClaims {
  exp: number;
  id: number;
  login: string;
  role: role;
}

export interface Error {
  Error: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const [cookies, setCookies] = useCookies(["Access_token"]);
  const [form, setForm] = useState<role>("patient");
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const changeForm = (form: role) => {
    setForm(form);
  };

  const submitLogin = useMutation({
    mutationFn: (user: loginData) => {
      return axios({
        method: "post",
        url: "http://localhost:8080/auth/login",
        data: user,
      });
    },
    onSuccess: (res) => {
      setCookies("Access_token", res.data["Access_token"], {
        sameSite: "none",
        secure: true,
      });
      let claims: tokenClaims = jwtDecode(res.data["Access_token"]);
      switch (claims.role) {
        case "patient":
          navigate("/makeAppointment");
          break;
        case "admin":
          navigate("/cabinets");
          break;
      }
    },
    onError: (error: AxiosError) => {
      let err: Error = error.response?.data as Error;
      Store.addNotification({
        title: "Ошибка",
        message: err.Error[0].toUpperCase() + err.Error.slice(1),
        insert: "top",
        container: "bottom-right",
        type: "danger",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
    },
  });

  return (
    <Layout>
      <div
        style={{
          width: "min(525px, 80%)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}>
        <div style={{ width: "100%", display: "flex", gap: "20px" }}>
          <Button
            label="Пациент"
            width="50%"
            active={form === "patient" ? true : false}
            onClick={() => changeForm("patient")}
          />
          <Button
            label="Администратор"
            width="50%"
            active={form === "admin" ? true : false}
            onClick={() => changeForm("admin")}
          />
        </div>
        <Input
          placeholder="Введите логин"
          value={login}
          onChange={(event) => {
            setLogin(event.target.value);
          }}
        />
        <Input
          type="password"
          placeholder="Введите пароль"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <Button
          label="Вход"
          width="100%"
          onClick={() => {
            submitLogin.mutate({
              role: form,
              login: login,
              password: password,
            });
          }}
        />
      </div>
    </Layout>
  );
};

export default LoginPage;
