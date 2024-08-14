import React, { useEffect, useState } from "react";
import Button from "./stories/button/Button";
import Layout from "./Layout";
import Input from "./stories/input/Input";
import Select, { SelectOption } from "./stories/select/Select";
import { useMutation } from "react-query";
import axios, { AxiosError } from "axios";
import { useCookies } from "react-cookie";
import InfoCard from "./stories/infoCard/InfoCard";
import { Store } from "react-notifications-component";
import { Error } from "./LoginPage";

export type action = "add" | "edit" | "delete";
export type specialization = {
  id: number;
  name: string;
};
type cabinet = {
  number: number;
  id_specialization: number;
};

const CabinetPage = () => {
  const [cookies] = useCookies(["Access_token"]);
  const [specsList, setSpecs] = useState<specialization[]>([]);
  const [cabinetsList, setCabinets] = useState<cabinet[]>([]);

  const [action, setAction] = useState<action>("add");
  const [inputedNumber, setInputedNumber] = useState<string>("");
  const [selectedSpec, setSelectedSpec] = useState<string>("");
  const [selectedSpecId, setSelectedSpecId] = useState<number>(-1);

  const [selectedCabinet, setSelectedCabinet] = useState<string>("");
  const [currectSpecId, setCurrentSpecId] = useState<number>(-1);

  const getSpecializations = useMutation({
    mutationFn: () => {
      return axios({
        headers: { Authorization: cookies.Access_token },
        method: "get",
        url: "http://localhost:8080/specialization/getSpecs",
      });
    },
    onSuccess: (res) => {
      console.log(res.data["specializations"]);
      setSpecs(res.data["specializations"]);
    },
  });

  const getCabinets = useMutation({
    mutationFn: () => {
      return axios({
        headers: { Authorization: cookies.Access_token },
        method: "get",
        url: "http://localhost:8080/cabinet/getCabinets",
      });
    },
    onSuccess: (res) => {
      setCabinets(res.data["cabinets"]);
    },
  });

  const addCabinet = useMutation({
    mutationFn: (cabinet: cabinet) => {
      return axios({
        headers: { Authorization: cookies.Access_token },
        method: "post",
        url: "http://localhost:8080/cabinet/addCabinet",
        data: cabinet,
      });
    },
    onSuccess: () => {
      Store.addNotification({
        title: "Успех",
        message: "Кабинет был успешно добавлен",
        insert: "top",
        container: "bottom-right",
        type: "info",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
      setInputedNumber("");
      setSelectedSpec("");
      setSelectedSpecId(-1);
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

  const editCabinet = useMutation({
    mutationFn: (cabinet: cabinet) => {
      return axios({
        headers: { Authorization: cookies.Access_token },
        method: "patch",
        url: "http://localhost:8080/cabinet/editCabinet",
        data: cabinet,
      });
    },
    onSuccess: () => {
      Store.addNotification({
        title: "Успех",
        message: "Кабинет был успешно изменён",
        insert: "top",
        container: "bottom-right",
        type: "info",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
      setSelectedCabinet("");
      setCurrentSpecId(-1);
      setSelectedSpec("");
      setSelectedSpecId(-1);
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

  const deleteCabinet = useMutation({
    mutationFn: (cabinetNumber: number) => {
      return axios({
        headers: { Authorization: cookies.Access_token },
        method: "delete",
        url: "http://localhost:8080/cabinet/deleteCabinet",
        data: { number: cabinetNumber },
      });
    },
    onSuccess: () => {
      Store.addNotification({
        title: "Успех",
        message: "Кабинет был успешно удалён",
        insert: "top",
        container: "bottom-right",
        type: "info",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
      setCabinets(
        cabinetsList.filter((el) => el.number !== parseInt(selectedCabinet))
      );
      setSelectedCabinet("");
      setSelectedSpecId(-1);
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

  useEffect(() => {
    switch (action) {
      case "add":
        setSelectedCabinet("");
        setSelectedSpec("");
        getSpecializations.mutate();
        break;
      case "edit":
        setSelectedCabinet("");
        setSelectedSpec("");
        getSpecializations.mutate();
        getCabinets.mutate();
        break;
      case "delete":
        getCabinets.mutate();
        setSelectedCabinet("");
        setSelectedSpec("");
        break;
    }
  }, [action]);

  const currentAction = () => {
    switch (action) {
      case "add":
        return (
          <>
            <Input
              placeholder="Введите номер кабинета"
              value={inputedNumber}
              onChange={(event) => {
                setInputedNumber(event.target.value);
                console.log(event.target.value);
              }}
            />
            <Select
              name="specialization"
              value={selectedSpec}
              options={specsList.map((el) => {
                let option: SelectOption = {
                  id: el.id,
                  value: el.name,
                };
                return option;
              })}
              onChange={(event) => {
                setSelectedSpecId(parseInt(event.target.selectedOptions[0].id));
                setSelectedSpec(event.target.selectedOptions[0].value);
              }}
            />
            <Button
              label="Добавить"
              onClick={() => {
                addCabinet.mutate({
                  number: parseInt(inputedNumber),
                  id_specialization: selectedSpecId,
                });
              }}
            />
          </>
        );
      case "edit":
        return (
          <>
            <Select
              name="cabinet"
              value={selectedCabinet}
              options={cabinetsList.map((el, index) => {
                let option: SelectOption = {
                  id: index,
                  value: el.number.toString(),
                };
                return option;
              })}
              onChange={(event) => {
                setSelectedCabinet(event.target.selectedOptions[0].value);
                setCurrentSpecId(
                  cabinetsList.find(
                    (el) =>
                      el.number ===
                      parseInt(event.target.selectedOptions[0].value)
                  )!.id_specialization
                );
              }}
            />
            {selectedCabinet ? (
              <>
                <InfoCard
                  text={
                    "Текущая специализация: " +
                    specsList.find(
                      (el) =>
                        el.id ===
                        cabinetsList.find(
                          (el) => el.number.toString() === selectedCabinet
                        )?.id_specialization
                    )?.name
                  }
                />
                <Select
                  name="specialization"
                  value={selectedSpec}
                  options={specsList
                    .filter((el) => el.id !== currectSpecId)
                    .map((el) => {
                      let option: SelectOption = {
                        id: el.id,
                        value: el.name,
                      };
                      return option;
                    })}
                  onChange={(event) => {
                    setSelectedSpecId(
                      parseInt(event.target.selectedOptions[0].id)
                    );
                    setSelectedSpec(event.target.selectedOptions[0].value);
                  }}
                />
                <Button
                  label="Изменить"
                  onClick={() => {
                    editCabinet.mutate({
                      number: parseInt(selectedCabinet),
                      id_specialization: selectedSpecId,
                    });
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
              value={selectedCabinet}
              options={cabinetsList.map((el, index) => {
                let option: SelectOption = {
                  id: index,
                  value: el.number.toString(),
                };
                return option;
              })}
              onChange={(event) => {
                setSelectedCabinet(event.target.selectedOptions[0].value);
                setCurrentSpecId(
                  cabinetsList.find(
                    (el) =>
                      el.number ===
                      parseInt(event.target.selectedOptions[0].value)
                  )!.id_specialization
                );
              }}
            />
            <Button
              label="Удалить"
              onClick={() => deleteCabinet.mutate(parseInt(selectedCabinet))}
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
