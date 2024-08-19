import React, { useEffect, useState } from "react";
import Button from "../stories/button/Button";
import Select, { SelectOption } from "../stories/select/Select";
import { useMutation } from "react-query";
import { useCookies } from "react-cookie";
import AppointmentCard from "../stories/appointmentCard/AppointmentCard";
import InfoCard from "../stories/infoCard/InfoCard";
import { Patient } from "../types/Auth.types";
import { Appointment } from "../types/Appointment.types";
import { GetPatientsMutation } from "../queries/Auth.queries";
import {
  CancelAppointmentMutation,
  GetAppointmentsByPatientIdMutation,
} from "../queries/Appointment.queries";
import { CallSuccessNotification } from "../utils/NotificationCall";
import Layout from "../stories/layout/Layout";
import { getFullName, getShortName } from "../utils/NameFormatting";

const ManageAppointmentsPage = () => {
  const [cookies] = useCookies(["Access_token"]);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [patient, setPatient] = useState<Patient>({ id: 0 } as Patient);

  const [openedAppointmentId, setOpenedAppointmentId] = useState<number>(-1);

  const { mutate: MutateGetPatients } = useMutation(
    GetPatientsMutation(cookies.Access_token, (res) => {
      setPatients(res.data["patients"] ? res.data["patients"] : []);
    })
  );

  const { mutate: MutateGetAppointmentsByPatientId } = useMutation(
    GetAppointmentsByPatientIdMutation(
      cookies.Access_token,
      patient.id,
      (res) => {
        setAppointments(
          res.data["appointments"] ? res.data["appointments"] : []
        );
      }
    )
  );

  const { mutate: MutateCancelAppointment } = useMutation(
    CancelAppointmentMutation(
      cookies.Access_token,
      {
        date: appointments[openedAppointmentId]
          ? appointments[openedAppointmentId].date
          : new Date(),
        cabinet_number: appointments[openedAppointmentId]
          ? appointments[openedAppointmentId].cabinet_number
          : 0,
        time_id: appointments[openedAppointmentId]
          ? appointments[openedAppointmentId].time_id
          : 0,
      },
      () => {
        CallSuccessNotification("Запись на приём была успешно отменена");
        setAppointments(
          appointments.filter((_, index) => index !== openedAppointmentId)
        );
      }
    )
  );

  useEffect(() => {
    MutateGetPatients();
  }, []);

  useEffect(() => {
    MutateGetAppointmentsByPatientId();
  }, [patient]);

  const showAppointments = () => {
    if (!patient.id) {
      return (
        <InfoCard text="Выберите пациента для отображения активных записей" />
      );
    }
    if (appointments.length == 0) {
      return <InfoCard text="У этого пациента нет активных записей" />;
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
                  fullName={last_name + " " + first_name + " " + second_name}
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
  };

  return (
    <Layout>
      <div
        style={{
          width: "min(800px, 80%)",
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
          <Select
            name="patient"
            value={patient.id ? getFullName(patient) : ""}
            options={patients.map((el) => {
              let option: SelectOption = {
                id: el.id,
                value:
                  getShortName(el) +
                  " | " +
                  el.passport_series.toString() +
                  " " +
                  el.passport_number.toString(),
              };
              return option;
            })}
            onChange={(event) => {
              setPatient(
                patients.find(
                  (el) => el.id === parseInt(event.target.selectedOptions[0].id)
                )!
              );
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
          {showAppointments()}
        </div>
      </div>
    </Layout>
  );
};

export default ManageAppointmentsPage;
