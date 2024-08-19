import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useCookies } from "react-cookie";
import { Gender } from "../types/Data.types";
import { GetGendersMutation } from "../queries/Data.queries";
import { RegisterPatientMutation } from "../queries/Auth.queries";
import { CallSuccessNotification } from "../utils/NotificationCall";
import Input from "../stories/input/Input";
import Select, { SelectOption } from "../stories/select/Select";
import Button from "../stories/button/Button";
import Layout from "../stories/layout/Layout";
import { RegisterPatientForm } from "../types/Auth.types";
import {
  fullNameRegex,
  passportNumberRegex,
  passportSeriesRegex,
  passwordRegex,
  snilsRegex,
} from "../utils/FormValidation";

const PatientsPage = () => {
  const [cookies] = useCookies(["Access_token"]);

  const [genders, setGenders] = useState<Gender[]>([]);

  const [formData, setFormData] = useState<RegisterPatientForm>({
    login: "",
    password: "",
    last_name: "",
    first_name: "",
    second_name: "",
    gender_id: -1,
    birth_date: new Date(),
    passport_series: "",
    passport_number: "",
    issuer: "",
    issue_date: new Date(),
    snils_number: "",
  });

  const [fullName, setFullName] = useState<string>("");
  const [gender, setGender] = useState<string>("");

  const { mutate: MutateGetGenders } = useMutation(
    GetGendersMutation(cookies.Access_token, (res) => {
      setGenders(res.data["genders"] ? res.data["genders"] : []);
    })
  );

  const ClearForm = () => {
    setFormData({
      login: "",
      password: "",
      last_name: "",
      first_name: "",
      second_name: "",
      gender_id: -1,
      birth_date: new Date(),
      passport_series: "",
      passport_number: "",
      issuer: "",
      issue_date: new Date(),
      snils_number: "",
    });
    setFullName("");
    setGender("");
  };

  const { mutate: MutateRegisterPatient } = useMutation(
    RegisterPatientMutation(cookies.Access_token, formData, () => {
      CallSuccessNotification("Пациент был успешно зарегистрирован");
      ClearForm();
    })
  );

  useEffect(() => {
    MutateGetGenders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <div
        style={{
          width: "min(625px, 80%)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}>
        <Input
          type="text"
          placeholder="Введите логин"
          value={formData.login}
          onChange={(event) => {
            setFormData((prev) => ({ ...prev, login: event.target.value }));
          }}
        />
        <Input
          type="password"
          placeholder="Введите пароль"
          value={formData.password}
          invalid={!passwordRegex.test(formData.password)}
          onChange={(event) => {
            setFormData((prev) => ({ ...prev, password: event.target.value }));
          }}
        />
        <Input
          type="text"
          placeholder="Введите ФИО"
          value={fullName}
          invalid={!fullNameRegex.test(fullName)}
          onChange={(event) => {
            setFullName(event.target.value);
            setFormData((prev) => ({
              ...prev,
              last_name: event.target.value.split(" ")[0],
              first_name: event.target.value.split(" ")[1],
              second_name: event.target.value.split(" ")[2],
            }));
          }}
        />
        <div style={{ width: "100%", display: "flex", gap: "20px" }}>
          <Select
            name="gender"
            value={gender}
            onChange={(event) => {
              setFormData((prev) => ({
                ...prev,
                gender_id: parseInt(event.target.selectedOptions[0].id),
              }));
              setGender(event.target.selectedOptions[0].value);
            }}
            options={genders.map((el) => {
              let option: SelectOption = {
                id: el.id,
                value: el.gender,
              };
              return option;
            })}
          />
          <Input
            type="date"
            value={
              formData.birth_date.getUTCDate() !== new Date().getUTCDate()
                ? formData.birth_date
                : ""
            }
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                birth_date: new Date(event.target.value),
              }))
            }
          />
        </div>
        <div style={{ width: "100%", display: "flex", gap: "20px" }}>
          <Input
            type="text"
            placeholder="Введите серию паспорта"
            value={formData.passport_series ? formData.passport_series : ""}
            invalid={!passportSeriesRegex.test(formData.passport_series)}
            onChange={(event) => {
              setFormData((prev) => ({
                ...prev,
                passport_series: event.target.value,
              }));
            }}
          />
          <Input
            type="text"
            placeholder="Введите номер паспорта"
            value={formData.passport_number ? formData.passport_number : ""}
            invalid={!passportNumberRegex.test(formData.passport_number)}
            onChange={(event) => {
              setFormData((prev) => ({
                ...prev,
                passport_number: event.target.value,
              }));
            }}
          />
        </div>
        <Input
          type="text"
          placeholder="Введите орган, выдавший паспорт"
          value={formData.issuer}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              issuer: event.target.value,
            }))
          }
        />
        <div style={{ width: "100%", display: "flex", gap: "20px" }}>
          <Input
            type="date"
            value={
              formData.issue_date.getUTCDate() !== new Date().getUTCDate()
                ? formData.issue_date
                : ""
            }
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                issue_date: new Date(event.target.value),
              }))
            }
          />
          <Input
            type="text"
            placeholder="Введите номер СНИЛС"
            value={formData.snils_number ? formData.snils_number : ""}
            invalid={!snilsRegex.test(formData.snils_number)}
            onChange={(event) => {
              setFormData((prev) => ({
                ...prev,
                snils_number: event.target.value,
              }));
            }}
          />
        </div>
        <Button
          label="Зарегистрировать пользователя"
          width="100%"
          disabled={
            formData.login &&
            formData.password &&
            formData.gender_id !== -1 &&
            formData.birth_date.getUTCDate() !== new Date().getUTCDate() &&
            formData.issuer &&
            formData.issue_date.getUTCDate() !== new Date().getUTCDate() &&
            fullNameRegex.test(fullName) &&
            passwordRegex.test(formData.password) &&
            passportSeriesRegex.test(formData.passport_series) &&
            passportNumberRegex.test(formData.passport_number) &&
            snilsRegex.test(formData.snils_number)
              ? false
              : true
          }
          onClick={() => {
            MutateRegisterPatient();
          }}
        />
      </div>
    </Layout>
  );
};

export default PatientsPage;
