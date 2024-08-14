import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import Button from "./stories/button/Button";
import Select, { SelectOption } from "./stories/select/Select";
import { useMutation } from "react-query";
import axios, { AxiosError } from "axios";
import { useCookies } from "react-cookie";
import { appointment, patient } from "./ProfilePage";
import AppointmentCard from "./stories/appointmentCard/AppointmentCard";
import { appointmentData } from "./AppointmentPage";
import InfoCard from "./stories/infoCard/InfoCard";
import { Store } from "react-notifications-component";
import { Error } from "./LoginPage";

const ManageAppointmentsPage = () => {
  const [cookies] = useCookies();

  const [patientsList, setPatients] = useState<patient[]>([]);

  const [selectedPatientId, setSelectedPatientId] = useState<number>(-1);
  const [selectedPatient, setSelectedPatient] = useState<string>("");

  const [appointments, setAppointments] = useState<appointment[]>();
  const [openedAppointmentId, setOpenedAppointmentId] = useState<number>(-1);

  const getPatients = useMutation({
    mutationFn: () => {
      return axios({
        headers: { Authorization: cookies.Access_token },
        method: "get",
        url: "http://localhost:8080/auth/getPatients",
      });
    },
    onSuccess: (res) => {
      setPatients(res.data["patients"]);
    },
  });

  const getAppointments = useMutation({
    mutationFn: (id_patient: number) => {
      return axios({
        headers: { Authorization: cookies.Access_token },
        method: "get",
        url: `http://localhost:8080/appointment/getAppointments?id_patient=${id_patient}`,
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
      setAppointments(
        appointments?.filter((_, index) => index !== openedAppointmentId)
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

  const showAppointments = () => {
    if (!appointments) {
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
  };

  useEffect(() => {
    getPatients.mutate();
  }, []);

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
            width="75%"
            value={selectedPatient}
            options={patientsList.map((el) => {
              let option: SelectOption = {
                id: el.id,
                value:
                  el.last_name +
                  " " +
                  el.first_name[0] +
                  ". " +
                  el.second_name[0] +
                  ". | " +
                  el.passport_series.toString() +
                  " " +
                  el.passport_number.toString(),
              };
              return option;
            })}
            onChange={(event) => {
              setSelectedPatientId(
                parseInt(event.target.selectedOptions[0].id)
              );
              setSelectedPatient(event.target.selectedOptions[0].value);
            }}
          />
          <Button
            label="Найти"
            width="25%"
            onClick={() => {
              getAppointments.mutate(selectedPatientId);
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
