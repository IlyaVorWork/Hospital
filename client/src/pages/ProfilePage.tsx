import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Patient } from "../types/Auth.types";
import { Appointment } from "../types/Appointment.types";
import {
  ChangePasswordMutation,
  GetPatientDataMutation,
} from "../queries/Auth.queries";
import {
  CancelAppointmentMutation,
  GetAppointmentsByPatientIdMutation,
} from "../queries/Appointment.queries";
import { CallSuccessNotification } from "../utils/NotificationCall";
import Loading from "../stories/loading/Loading";
import InfoCard from "../stories/infoCard/InfoCard";
import DualTextCard from "../stories/dualTextCard/DualTextCard";
import Button from "../stories/button/Button";
import AppointmentCard from "../stories/appointmentCard/AppointmentCard";
import Input from "../stories/input/Input";
import Layout from "../stories/layout/Layout";
import { passwordRegex } from "../utils/FormValidation";

type ProfilePart = "data" | "appointments" | "changePassword";

const ProfilePage = () => {
  const { state } = useLocation();
  const [cookies] = useCookies(["Access_token"]);
  const [part, setPart] = useState<ProfilePart>("data");
  const [patient, setPatient] = useState<Patient>({} as Patient);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordCopy, setNewPasswordCopy] = useState<string>("");
  const [newPasswordValid, setNewPasswordValid] = useState({
    new_password: false,
    new_password_copy: false,
  });

  const [openedAppointmentId, setOpenedAppointmentId] = useState<number>(-1);

  const changePart = (part: ProfilePart) => {
    setPart(part);
  };

  const { mutate: MutateGetPatientData, isLoading: GetPatientDataIsLoading } =
    useMutation(
      GetPatientDataMutation(cookies.Access_token, (res) => {
        setPatient(res.data["patient_data"]);
      })
    );

  const {
    mutate: MutateGetAppointmentsByPatientId,
    isLoading: GetAppointmentsByPatinetIdIsLoading,
  } = useMutation(
    GetAppointmentsByPatientIdMutation(
      cookies.Access_token,
      patient!.id,
      (res) => {
        setAppointments(
          res.data["appointments"] ? res.data["appointments"] : []
        );
      }
    )
  );

  const { mutate: MutateChangePassword } = useMutation(
    ChangePasswordMutation(cookies.Access_token, newPassword, () => {
      CallSuccessNotification("Пароль был успешно изменён");
      setNewPassword("");
      setNewPasswordCopy("");
    })
  );

  const { mutate: MutateCancelAppointment } = useMutation(
    CancelAppointmentMutation(
      cookies.Access_token,
      appointments[openedAppointmentId]
        ? {
            date: appointments[openedAppointmentId].date,
            cabinet_number: appointments[openedAppointmentId].cabinet_number,
            time_id: appointments[openedAppointmentId].time_id,
          }
        : { date: new Date(), cabinet_number: 0, time_id: 0 },
      () => {
        CallSuccessNotification("Запись на приём была успешно отменена");
        setAppointments(
          appointments.filter((_, index) => index !== openedAppointmentId)
        );
      }
    )
  );

  useEffect(() => {
    if (state) {
      console.log("Биба");
      setPart(state.part);
      CallSuccessNotification("Вы были успешно записаны на приём");
    }
  }, [state]);

  useEffect(() => {
    switch (part) {
      case "data":
        MutateGetPatientData();
        break;
      case "changePassword":
        setNewPassword("");
        setNewPasswordCopy("");
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [part]);

  useEffect(() => {
    if (part === "appointments" && patient.id) {
      MutateGetAppointmentsByPatientId();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [part, patient]);

  const partContent = () => {
    switch (part) {
      case "data": {
        if (GetPatientDataIsLoading) {
          return <Loading />;
        }

        if (!patient.id) {
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
        if (GetAppointmentsByPatinetIdIsLoading) {
          return <Loading />;
        }

        if (appointments.length === 0) {
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
                        MutateCancelAppointment();
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
              invalid={!newPasswordValid.new_password}
              placeholder="Введите новый пароль"
              onChange={(event) => {
                setNewPassword(event.target.value);
                setNewPasswordValid((prev) => ({
                  ...prev,
                  new_password: passwordRegex.test(event.target.value),
                }));
              }}
            />
            <Input
              type="password"
              value={newPasswordCopy}
              invalid={!newPasswordValid.new_password_copy}
              placeholder="Введите новый пароль ещё раз"
              onChange={(event) => {
                setNewPasswordCopy(event.target.value);
                setNewPasswordValid((prev) => ({
                  ...prev,
                  new_password_copy: event.target.value === newPassword,
                }));
              }}
            />
            <Button
              label="Изменить"
              width="100%"
              disabled={
                newPasswordValid.new_password &&
                newPasswordValid.new_password_copy
                  ? false
                  : true
              }
              onClick={() => {
                MutateChangePassword();
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
