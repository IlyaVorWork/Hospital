import React, { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { Role, TokenClaims } from "../types/Auth.types";
import { LoginUserMutation } from "../queries/Auth.queries";
import Button from "../stories/button/Button";
import Input from "../stories/input/Input";
import Layout from "../stories/layout/Layout";

const LoginPage = () => {
  const navigate = useNavigate();
  const [, setCookies] = useCookies(["Access_token"]);
  const [role, setRole] = useState<Role>("patient");
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { mutate: MutateLoginUser } = useMutation(
    LoginUserMutation(
      { role: role, login: login, password: password },
      (res) => {
        setCookies("Access_token", res.data["Access_token"], {
          sameSite: "none",
          secure: true,
        });
        let claims: TokenClaims = jwtDecode(res.data["Access_token"]);
        switch (claims.role) {
          case "patient":
            navigate("/makeAppointment");
            break;
          case "admin":
            navigate("/patients");
            break;
        }
      }
    )
  );

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
            active={role === "patient" ? true : false}
            onClick={() => setRole("patient")}
          />
          <Button
            label="Администратор"
            width="50%"
            active={role === "admin" ? true : false}
            onClick={() => setRole("admin")}
          />
        </div>
        <Input
          type="text"
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
          disabled={login && password ? false : true}
          onClick={() => MutateLoginUser()}
        />
      </div>
    </Layout>
  );
};

export default LoginPage;
