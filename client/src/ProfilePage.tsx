import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import Input from "./stories/input/Input";
import Button from "./stories/button/Button";
import { useMutation } from "react-query";
import axios, { AxiosError } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import DualTextCard from "./stories/dualTextCard/DualTextCard";
import AppointmentCard from "./stories/appointmentCard/AppointmentCard";
import Loading from "./stories/loading/Loading";
import InfoCard from "./stories/infoCard/InfoCard";
import { Store } from "react-notifications-component";
import { Error } from "./LoginPage";

type profilePart = "data" | "appointments" | "changePassword";

export type patient = {
  id: number;
  login: string;
  last_name: string;
  first_name: string;
  second_name: string;
  birth_date: Date;
  sex_id: number;
  passport_series: number;
  passport_number: number;
  issue_date: Date;
  issuer: string;
  snils_number: number;
};

export type appointment = {
  date: Date;
  cabinet_number: number;
  id_specialization: number;
  specialization: string;
  time_id: number;
  time: string;
  doctor_id: number;
  last_name: string;
  first_name: string;
  second_name: string;
  img_url: string;
};

type appointmentData = {
  date: Date;
  cabinet_number: number;
  time_id: number;
};

const ProfilePage = () => {
  const { state } = useLocation();
  const [cookies] = useCookies(["Access_token"]);
  const [part, setPart] = useState<profilePart>("data");
  const [patient, setPatient] = useState<patient | null>();
  const [appointments, setAppointments] = useState<appointment[]>([]);

  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordCopy, setNewPasswordCopy] = useState<string>("");

  const [openedAppointmentId, setOpenedAppointmentId] = useState<number>(-1);

  const changePart = (part: profilePart) => {
    setPart(part);
  };

  const getPatientData = useMutation({
    mutationFn: () => {
      return axios({
        headers: { Authorization: cookies.Access_token },
        method: "get",
        url: "http://localhost:8080/auth/getPatientData",
      });
    },
    onSuccess: (res) => {
      setPatient(res.data["patient_data"]);
    },
  });

  const getPatientAppointments = useMutation({
    mutationFn: () => {
      return axios({
        headers: { Authorization: cookies.Access_token },
        method: "get",
        url: "http://localhost:8080/appointment/getPatientAppointments",
      });
    },
    onSuccess: (res) => {
      setAppointments(res.data["appointments"] ? res.data["appointments"] : []);
    },
  });

  const cancelAppointment = useMutation({
    mutationFn: (appointmentData: appointmentData) => {
      return axios({
        headers: { Authorization: cookies.Access_token },
        method: "patch",
        url: "http://localhost:8080/appointment/cancelAppointment",
        data: appointmentData,
      });
    },
    onSuccess: () => {
      Store.addNotification({
        title: "Успех",
        message: "Запись на приём была успешно отменена",
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
      setNewPassword("");
      setNewPasswordCopy("");
      setAppointments(
        appointments.filter((_, index) => index !== openedAppointmentId)
      );
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

  const changePassword = useMutation({
    mutationFn: (newPassword: string) => {
      return axios({
        headers: { Authorization: cookies.Access_token },
        method: "patch",
        url: "http://localhost:8080/auth/changePassword",
        data: { password: newPassword },
      });
    },
    onSuccess: () => {
      Store.addNotification({
        title: "Успех",
        message: "Пароль был успешно изменён",
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
      setNewPassword("");
      setNewPasswordCopy("");
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
    if (state) {
      setPart(state.part);
      console.log("Успех", state.part);
      Store.addNotification({
        title: "Успех",
        message: "Вы были успешно записаны на приём",
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
    }
  }, []);

  useEffect(() => {
    switch (part) {
      case "data":
        getPatientData.mutate();
        break;
      case "appointments":
        getPatientAppointments.mutate();
        break;
      case "changePassword":
        setNewPassword("");
        setNewPasswordCopy("");
        break;
    }
  }, [part]);

  const partContent = () => {
    switch (part) {
      case "data": {
        if (getPatientData.isLoading) {
          return <Loading />;
        }

        if (patient == null) {
          return <InfoCard text="Ошибка: данные не найдены" type="error" />;
        }

        return (
          <>
            <DualTextCard
              leftContent="ФИО"
              rightContent={
                patient!.last_name +
                " " +
                patient!.first_name +
                " " +
                patient!.second_name
              }
            />
            <div style={{ width: "100%", display: "flex", gap: "20px" }}>
              <DualTextCard leftContent="Пол" rightContent="Пол" />
              <DualTextCard
                leftContent="Дата рождения"
                rightContent={new Date(
                  patient!.birth_date
                ).toLocaleDateString()}
              />
            </div>
            <div style={{ width: "100%", display: "flex", gap: "20px" }}>
              <DualTextCard
                leftContent="Серия паспорта"
                rightContent={patient!.passport_series.toString()}
              />
              <DualTextCard
                leftContent="Номер паспорта"
                rightContent={patient!.passport_number.toString()}
              />
            </div>
            <DualTextCard
              leftContent="Паспорт выдан"
              rightContent={patient!.issuer}
            />
            <div style={{ width: "100%", display: "flex", gap: "20px" }}>
              <DualTextCard
                leftContent="Дата выдачи"
                rightContent={new Date(
                  patient!.issue_date
                ).toLocaleDateString()}
              />
              <DualTextCard
                leftContent="Номер СНИЛС"
                rightContent={patient!.snils_number.toString()}
              />
            </div>
            <Button
              label="Сменить пароль"
              width="100%"
              onClick={() => {
                setPart("changePassword");
              }}
            />
            {}
          </>
        );
      }
      case "appointments": {
        if (getPatientAppointments.isLoading) {
          return <Loading />;
        }

        if (appointments.length == 0) {
          return <InfoCard text="В данный момент у Вас нет активных записей" />;
        }

        return (
          <div
            style={{
              width: "calc(100% + 12px)",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              height: "454px",
              padding: "6px",
              margin: "-6px",
              overflowY: "scroll",
              scrollSnapType: "y mandatory",
            }}>
            {appointments.map(
              (
                {
                  date,
                  cabinet_number,
                  specialization,
                  time_id,
                  time,
                  last_name,
                  first_name,
                  second_name,
                  img_url,
                },
                index
              ) => {
                return (
                  <div
                    onClick={() =>
                      setOpenedAppointmentId(
                        openedAppointmentId === index ? -1 : index
                      )
                    }>
                    <AppointmentCard
                      key={index}
                      specialization={specialization}
                      fullName={
                        last_name + " " + first_name + " " + second_name
                      }
                      url={img_url}
                      date={new Date(date).toLocaleDateString()}
                      time={time}
                      cabinetNumber={cabinet_number}
                      isOpened={openedAppointmentId === index}
                      onClick={(event) => {
                        cancelAppointment.mutate({
                          date,
                          cabinet_number,
                          time_id,
                        });

                        event?.stopPropagation();
                      }}
                    />
                  </div>
                );
              }
            )}
          </div>
        );
      }
      case "changePassword": {
        return (
          <>
            <Input
              type="password"
              value={newPassword}
              placeholder="Введите новый пароль"
              onChange={(event) => setNewPassword(event.target.value)}
            />
            <Input
              type="password"
              value={newPasswordCopy}
              placeholder="Введите новый пароль ещё раз"
              onChange={(event) => setNewPasswordCopy(event.target.value)}
            />
            <Button
              label="Изменить"
              width="100%"
              onClick={() => {
                if (newPassword === newPasswordCopy) {
                  changePassword.mutate(newPassword);
                } else {
                  Store.addNotification({
                    title: "Ошибка",
                    message: "Пароли не совпадают",
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
                }
              }}
            />
          </>
        );
      }
    }
  };

  return (
    <Layout>
      <div
        style={{
          width: "min(800px, 80%)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}>
        <div style={{ width: "100%", display: "flex", gap: "20px" }}>
          <Button
            label="Данные о пациенте"
            width="50%"
            active={part === "data" ? true : false}
            onClick={() => {
              changePart("data");
            }}
          />
          <Button
            label="Активные записи"
            width="50%"
            active={part === "appointments" ? true : false}
            onClick={() => {
              changePart("appointments");
            }}
          />
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            alignItems: "center",
            height: "460px",
          }}>
          {partContent()}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
