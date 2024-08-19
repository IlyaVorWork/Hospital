import { useEffect, useState } from "react";
import Button from "../stories/button/Button";
import Input from "../stories/input/Input";
import Select, { SelectOption } from "../stories/select/Select";
import { useMutation } from "react-query";
import { useCookies } from "react-cookie";
import { CallSuccessNotification } from "../utils/NotificationCall";
import { Doctor } from "../types/Doctor.types";
import { Specialization } from "../types/Data.types";
import { getFullName } from "../utils/NameFormatting";
import { GetSpecializationsMutation } from "../queries/Data.queries";
import {
  AddDoctorMutation,
  DeleteDoctorMutation,
  EditDoctorMutation,
  GetDoctorsMutation,
} from "../queries/Doctor.queries";
import Layout from "../stories/layout/Layout";
import { fullNameRegex, imgUrlRegex } from "../utils/FormValidation";

type Action = "add" | "edit" | "delete";

const DoctorsPage = () => {
  const [cookies] = useCookies(["Access_token"]);
  const [action, setAction] = useState<Action>("add");

  const [specs, setSpecs] = useState<Specialization[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [fullName, setFullName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  const [spec, setSpec] = useState<Specialization>({ id: 0 } as Specialization);
  const [doctor, setDoctor] = useState<Doctor>({ id: 0 } as Doctor);

  const ClearForms = () => {
    setFullName("");
    setAvatarUrl("");
    setSpec({ id: 0 } as Specialization);
    setDoctor({ id: 0 } as Doctor);
  };

  const { mutate: MutateGetSpecializations } = useMutation(
    GetSpecializationsMutation(cookies.Access_token, (res) => {
      setSpecs(res.data["specializations"]);
    })
  );

  const { mutate: MutateGetDoctors } = useMutation(
    GetDoctorsMutation(cookies.Access_token, (res) => {
      setDoctors(res.data["doctors"]);
    })
  );

  const { mutate: MutateAddDoctor } = useMutation(
    AddDoctorMutation(
      cookies.Access_token,
      {
        last_name: fullName.split(" ")[0],
        first_name: fullName.split(" ")[1],
        second_name: fullName.split(" ")[2],
        img_url: avatarUrl,
        specialization_id: spec.id,
      },
      () => {
        CallSuccessNotification("Информация о враче была успешно добавлена");
        ClearForms();
      }
    )
  );

  const { mutate: MutateEditDoctor } = useMutation(
    EditDoctorMutation(
      cookies.Access_token,
      {
        id: doctor.id,
        last_name: fullName.split(" ")[0],
        first_name: fullName.split(" ")[1],
        second_name: fullName.split(" ")[2],
        img_url: avatarUrl,
      },
      () => {
        CallSuccessNotification("Информация о враче была успешно изменена");
        setDoctors(
          doctors.map((el) =>
            el.id === doctor.id
              ? ({
                  ...el,
                  last_name: fullName.split(" ")[0],
                  first_name: fullName.split(" ")[1],
                  second_name: fullName.split(" ")[2],
                  img_url: avatarUrl,
                } as Doctor)
              : el
          )
        );
        ClearForms();
      }
    )
  );

  const { mutate: MutateDeleteDoctor } = useMutation(
    DeleteDoctorMutation(cookies.Access_token, doctor.id, () => {
      CallSuccessNotification("Доктор был успешно удалён");
      setDoctors(doctors.filter((el) => el.id !== doctor.id));
      ClearForms();
    })
  );

  useEffect(() => {
    switch (action) {
      case "add":
        ClearForms();
        MutateGetSpecializations();
        break;
      case "edit":
        ClearForms();
        MutateGetDoctors();
        break;
      case "delete":
        ClearForms();
        MutateGetDoctors();
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);

  const currentAction = () => {
    switch (action) {
      case "add":
        return (
          <>
            <Input
              type="text"
              placeholder="Введите ФИО"
              value={fullName}
              invalid={!fullNameRegex.test(fullName)}
              onChange={(event) => setFullName(event.target.value)}
            />
            <Input
              type="text"
              placeholder={"Введите ссылку на фото"}
              value={avatarUrl}
              invalid={!imgUrlRegex.test(avatarUrl)}
              onChange={(event) => setAvatarUrl(event.target.value)}
            />
            <Select
              name="specialization"
              value={spec.id ? spec.name : ""}
              options={specs.map((el) => {
                let option: SelectOption = {
                  id: el.id,
                  value: el.name,
                };
                return option;
              })}
              onChange={(event) =>
                setSpec(
                  specs.find(
                    (el) =>
                      el.id === parseInt(event.target.selectedOptions[0].id)
                  )!
                )
              }
            />
            <Button
              label="Добавить"
              disabled={
                fullNameRegex.test(fullName) &&
                imgUrlRegex.test(avatarUrl) &&
                spec.id
                  ? false
                  : true
              }
              onClick={() => MutateAddDoctor()}
            />
          </>
        );
      case "edit":
        return (
          <>
            <Select
              name="doctor"
              value={doctor.id ? getFullName(doctor) : ""}
              options={doctors.map((el) => {
                let option: SelectOption = {
                  id: el.id,
                  value: getFullName(el),
                };
                return option;
              })}
              onChange={(event) => {
                setDoctor(
                  doctors.find(
                    (el) =>
                      el.id === parseInt(event.target.selectedOptions[0].id)
                  )!
                );
                setFullName(event.target.selectedOptions[0].value);
                setAvatarUrl(
                  doctors.find(
                    (el) =>
                      el.id === parseInt(event.target.selectedOptions[0].id)
                  )!.img_url
                );
              }}
            />
            {doctor.id ? (
              <>
                <Input
                  type="text"
                  placeholder={"Введите ФИО"}
                  value={fullName}
                  invalid={!fullNameRegex.test(fullName)}
                  onChange={(event) => setFullName(event.target.value)}
                />
                <Input
                  type="text"
                  placeholder={"Введите ссылку на фото"}
                  value={avatarUrl}
                  invalid={!imgUrlRegex.test(avatarUrl)}
                  onChange={(event) => setAvatarUrl(event.target.value)}
                />
                <Button
                  label="Изменить"
                  disabled={
                    (fullName.trim() !== getFullName(doctor) ||
                      avatarUrl.trim() !== doctor.img_url) &&
                    fullNameRegex.test(fullName) &&
                    imgUrlRegex.test(avatarUrl) &&
                    doctor.id
                      ? false
                      : true
                  }
                  onClick={() => MutateEditDoctor()}
                />
              </>
            ) : null}
          </>
        );
      case "delete":
        return (
          <>
            <Select
              name="doctor"
              value={
                doctor.id
                  ? getFullName(doctor) +
                    " " +
                    specs.find((el) => el.id === doctor.specialization_id)?.name
                  : ""
              }
              options={doctors.map((el) => {
                let option: SelectOption = {
                  id: el.id,
                  value: getFullName(el),
                };
                return option;
              })}
              onChange={(event) => {
                setDoctor(
                  doctors.find(
                    (el) =>
                      el.id === parseInt(event.target.selectedOptions[0].id)
                  )!
                );
              }}
            />
            <Button
              label="Удалить"
              disabled={doctor.id ? false : true}
              onClick={() => {
                MutateDeleteDoctor();
              }}
            />
          </>
        );
    }
  };

  return (
    <Layout>
      <div
        style={{
          width: "525px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            gap: "20px",
          }}>
          <Button
            label="Добавить"
            width="33%"
            active={action === "add" ? true : false}
            onClick={() => setAction("add")}
          />
          <Button
            label="Изменить"
            width="33%"
            active={action === "edit" ? true : false}
            onClick={() => setAction("edit")}
          />
          <Button
            label="Удалить"
            width="33%"
            active={action === "delete" ? true : false}
            onClick={() => setAction("delete")}
          />
        </div>
        <div
          style={{
            width: "100%",
            height: "300px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}>
          {currentAction()}
        </div>
      </div>
    </Layout>
  );
};

export default DoctorsPage;
