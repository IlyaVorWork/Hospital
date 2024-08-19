import React, { useEffect, useState } from "react";
import Button from "../stories/button/Button";
import Input from "../stories/input/Input";
import Select, { SelectOption } from "../stories/select/Select";
import { useMutation } from "react-query";
import { useCookies } from "react-cookie";
import InfoCard from "../stories/infoCard/InfoCard";
import { Specialization } from "../types/Data.types";
import {
  AddCabinetMutation,
  DeleteCabinetMutation,
  EditCabinetMutation,
  GetCabinetsMutation,
} from "../queries/Cabinet.queries";
import { CallSuccessNotification } from "../utils/NotificationCall";
import { Cabinet } from "../types/Cabinet.types";
import { GetSpecializationsMutation } from "../queries/Data.queries";
import Layout from "../stories/layout/Layout";
import { cabinetNumberRegex } from "../utils/FormValidation";

type Action = "add" | "edit" | "delete";

const CabinetPage = () => {
  const [cookies] = useCookies(["Access_token"]);
  const [action, setAction] = useState<Action>("add");

  const [specs, setSpecs] = useState<Specialization[]>([]);
  const [cabinets, setCabinets] = useState<Cabinet[]>([]);

  const [number, setNumber] = useState<string>("");
  const [spec, setSpec] = useState<Specialization>({ id: 0 } as Specialization);

  const [cabinet, setCabinet] = useState<Cabinet>({ number: 0 } as Cabinet);
  const [currectSpecId, setCurrentSpecId] = useState<number>(-1);

  const ClearForms = () => {
    setNumber("");
    setSpec({ id: 0 } as Specialization);
    setCabinet({ number: 0 } as Cabinet);
    setCurrentSpecId(-1);
  };

  const { mutate: MutateGetSpecializations } = useMutation(
    GetSpecializationsMutation(cookies.Access_token, (res) => {
      setSpecs(res.data["specializations"] ? res.data["specializations"] : []);
    })
  );

  const { mutate: MutateGetCabinets } = useMutation(
    GetCabinetsMutation(cookies.Access_token, (res) => {
      setCabinets(res.data["cabinets"] ? res.data["cabinets"] : []);
    })
  );

  const { mutate: MutateAddCabinet } = useMutation(
    AddCabinetMutation(
      cookies.Access_token,
      {
        number: parseInt(number),
        specialization_id: spec.id,
      },
      () => {
        CallSuccessNotification("Кабинет был успешно добавлен");
        ClearForms();
      }
    )
  );

  const { mutate: MutateEditCabinet } = useMutation(
    EditCabinetMutation(
      cookies.Access_token,
      {
        number: cabinet.number,
        specialization_id: spec.id,
      },
      () => {
        CallSuccessNotification("Кабинет был успешно изменён");
        setCabinets(
          cabinets.map((el) =>
            el.number === cabinet.number
              ? ({ ...el, specialization_id: spec.id } as Cabinet)
              : el
          )
        );
        ClearForms();
      }
    )
  );

  const { mutate: MutateDeleteCabinet } = useMutation(
    DeleteCabinetMutation(cookies.Access_token, cabinet.number, () => {
      CallSuccessNotification("Кабинет был успешно удалён");
      setCabinets(cabinets.filter((el) => el.number !== cabinet.number));
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
        MutateGetSpecializations();
        MutateGetCabinets();
        break;
      case "delete":
        ClearForms();
        MutateGetCabinets();
        break;
    }
  }, [action]);

  const currentAction = () => {
    switch (action) {
      case "add":
        return (
          <>
            <Input
              type="text"
              placeholder="Введите номер кабинета"
              invalid={!cabinetNumberRegex.test(number)}
              value={number}
              onChange={(event) => setNumber(event.target.value)}
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
              onChange={(event) => {
                setSpec(
                  specs.find(
                    (el) =>
                      el.id === parseInt(event.target.selectedOptions[0].id)
                  )!
                );
              }}
            />
            <Button
              label="Добавить"
              disabled={
                cabinetNumberRegex.test(number) && spec.id ? false : true
              }
              onClick={() => {
                MutateAddCabinet();
              }}
            />
          </>
        );
      case "edit":
        return (
          <>
            <Select
              name="cabinet"
              value={cabinet.number ? cabinet.number.toString() : ""}
              options={cabinets.map((el, index) => {
                let option: SelectOption = {
                  id: index,
                  value: el.number.toString(),
                };
                return option;
              })}
              onChange={(event) => {
                setCabinet(
                  cabinets.find(
                    (el) =>
                      el.number ===
                      parseInt(event.target.selectedOptions[0].value)
                  )!
                );
                setCurrentSpecId(
                  cabinets.find(
                    (el) =>
                      el.number ===
                      parseInt(event.target.selectedOptions[0].value)
                  )!.specialization_id
                );
              }}
            />
            {cabinet.number ? (
              <>
                <InfoCard
                  text={
                    "Текущая специализация: " +
                    specs.find((el) => el.id === currectSpecId)?.name
                  }
                />
                <Select
                  name="specialization"
                  value={spec.id ? spec.name : ""}
                  options={specs
                    .filter((el) => el.id !== currectSpecId)
                    .map((el) => {
                      let option: SelectOption = {
                        id: el.id,
                        value: el.name,
                      };
                      return option;
                    })}
                  onChange={(event) => {
                    setSpec(
                      specs.find(
                        (el) =>
                          el.id === parseInt(event.target.selectedOptions[0].id)
                      )!
                    );
                  }}
                />
                <Button
                  label="Изменить"
                  disabled={spec.id ? false : true}
                  onClick={() => {
                    MutateEditCabinet();
                  }}
                />
              </>
            ) : null}
          </>
        );
      case "delete":
        return (
          <>
            <Select
              name="cabinet"
              value={cabinet.number ? cabinet.number.toString() : ""}
              options={cabinets.map((el, index) => {
                let option: SelectOption = {
                  id: index,
                  value: el.number.toString(),
                };
                return option;
              })}
              onChange={(event) => {
                setCabinet(
                  cabinets.find(
                    (el) =>
                      el.number ===
                      parseInt(event.target.selectedOptions[0].value)
                  )!
                );
              }}
            />
            <Button
              label="Удалить"
              disabled={cabinet.number ? false : true}
              onClick={() => MutateDeleteCabinet()}
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

export default CabinetPage;
