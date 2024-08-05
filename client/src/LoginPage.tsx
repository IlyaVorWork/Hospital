import React, { useState } from "react";
import Layout from "./Layout";
import Input from "./stories/input/Input";
import Button from "./stories/button/Button";
import { useMutation } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

type formRole = "patient" | "admin";

const LoginPage = () => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useCookies(["Access_token"]);
  const [form, setForm] = useState<formRole>("patient");
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  type loginData = {
    role: string;
    login: string;
    password: string;
  };

  const changeForm = (form: formRole) => {
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
      setAccessToken("Access_token", res.data["Access_token"]);
      console.log(accessToken);
      navigate("/assign");
    },
  });

  console.log(accessToken);

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
            console.log(login);
          }}
        />
        <Input
          type="password"
          placeholder="Введите пароль"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            console.log(password);
          }}
        />
        <Button
          label="Вход"
          width="100%"
          onClick={() => {
            console.log("Абоба");
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
