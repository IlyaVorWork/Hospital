import React, { useEffect, useState } from "react";
import Steps from "../stories/steps/Steps";
import Button from "../stories/button/Button";
import DualButton from "../stories/dualButton/DualButton";
import DualCancelButton from "../stories/dualButton/DualCancelButton";
import DoctorCard from "../stories/doctorCard/DoctorCard";
import Input from "../stories/input/Input";
import Select, { SelectOption } from "../stories/select/Select";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Loading from "../stories/loading/Loading";
import InfoCard from "../stories/infoCard/InfoCard";
import { useMutation } from "react-query";
import { getShortName } from "../utils/NameFormatting";
import { Specialization } from "../types/Data.types";
import { Doctor } from "../types/Doctor.types";
import { Ticket } from "../types/Appointment.types";
import { GetSpecializationsMutation } from "../queries/Data.queries";
import { GetDoctorsBySpecializationIdMutation } from "../queries/Doctor.queries";
import {
  GetFreeAppointmentsMutation,
  MakeAppointmentMutation,
} from "../queries/Appointment.queries";
import Layout from "../stories/layout/Layout";

type Step = 1 | 2 | 3;

const AppointmentPage = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["Access_token"]);
  const [step, setStep] = useState<Step>(1);

  const [specs, setSpecs] = useState<Specialization[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);

  const [spec, setSpec] = useState<Specialization>({} as Specialization);
  const [doctor, setDoctor] = useState<Doctor>({} as Doctor);

  const [date, setDate] = useState<Date>();
  const [ticketId, setTicketId] = useState<number>(-1);
  const [time, setTime] = useState<string>("");

  const {
    mutate: mutateGetSpecializations,
    isLoading: getSpecializationsIsLoading,
  } = useMutation(
    GetSpecializationsMutation(cookies.Access_token, (res) => {
      setSpecs(res.data["specializations"] ? res.data["specializations"] : []);
    })
  );

  const { mutate: mutateGetDoctors, isLoading: getDoctorsIsLoading } =
    useMutation(
      GetDoctorsBySpecializationIdMutation(
        cookies.Access_token,
        spec.id,
        (res) => {
          setDoctors(res.data["doctors"] ? res.data["doctors"] : []);
        }
      )
    );

  const {
    mutate: mutateGetFreeAppointments,
    isLoading: getFreeAppointmentsIsLoading,
  } = useMutation(
    GetFreeAppointmentsMutation(cookies.Access_token, doctor.id, (res) => {
      setTickets(
        res.data["tickets"]
          ? res.data["tickets"].map((el: Ticket, index: number) => ({
              ...el,
              id: index,
            }))
          : []
      );
    })
  );

  const { mutate: mutateMakeAppointment } = useMutation(
    MakeAppointmentMutation(
      cookies.Access_token,
      filteredTickets[ticketId],
      () => {
        navigate("/profile", { state: { part: "appointments" } });
      }
    )
  );

  useEffect(() => {
    switch (step) {
      case 1:
        mutateGetSpecializations();
        break;
      case 2:
        mutateGetDoctors();
        break;
      case 3:
        mutateGetFreeAppointments();
        break;
    }
  }, [step]);

  const filterTickets = (tickets: Ticket[], date: Date) => {
    setFilteredTickets(
      tickets.filter((el) => new Date(el.date).getTime() === date.getTime())
    );
  };

  const selectOptions = (tickets: Ticket[]) => {
    let options = tickets.map((el, index) => {
      let option: SelectOption = { id: index, value: el.time };
      return option;
    });

    return options;
  };

  const currentStep = () => {
    switch (step) {
      case 1: {
        if (getSpecializationsIsLoading) {
          return <Loading />;
        }

        if (specs == null) {
          return (
            <InfoCard text="Данные о специализациях не найдены" type="error" />
          );
        }

        return (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              height: "400px",
              margin: "-6px",
              padding: "6px",
              overflowY: "scroll",
              scrollSnapType: "y mandatory",
            }}>
            {specs.map((spec) => {
              return (
                <DualButton
                  key={spec.id}
                  specialization={spec.name}
                  ticketCount={spec.ticket_count}
                  onClick={() => {
                    setSpec(spec);
                    setStep(2);
                  }}
                />
              );
            })}
          </div>
        );
      }
      case 2: {
        if (getDoctorsIsLoading) {
          return <Loading />;
        }

        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "25px",
            }}>
            <DualCancelButton
              choice={spec!.name}
              onClick={() => {
                setSpec({} as Specialization);
                setStep(1);
              }}
            />
            {doctors.length === 0 ? (
              <InfoCard
                text="В данный момент нет врачей выбранной специализации"
                type="error"
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  gap: "25px",
                  padding: "6px",
                  margin: "-6px",
                  overflowX: "scroll",
                  scrollSnapType: "x mandatory",
                }}>
                {doctors.map((doctor) => {
                  return (
                    <DoctorCard
                      key={doctor.id}
                      id={doctor.id}
                      doctorName={getShortName(doctor)}
                      ticketCount={doctor.ticket_count}
                      url={doctor.img_url}
                      onClick={() => {
                        setDoctor(doctor);
                        setStep(3);
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      }
      case 3: {
        if (getFreeAppointmentsIsLoading) {
          return <Loading />;
        }

        return (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
              <DualCancelButton
                choice={spec.name}
                onClick={() => {
                  setSpec({} as Specialization);
                  setDoctor({} as Doctor);
                  setStep(1);
                }}
              />
              <DualCancelButton
                choice={getShortName(doctor)}
                onClick={() => {
                  setDoctor({} as Doctor);
                  setStep(2);
                }}
              />
              {tickets.length === 0 ? (
                <InfoCard
                  text="В данный момент у выбранного врача нет свободных талонов"
                  type="error"
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "25px",
                  }}>
                  <Input
                    type="date"
                    value={date}
                    onChange={(event) => {
                      setDate(new Date(event.target.value));
                      filterTickets(tickets, new Date(event.target.value));
                      setTime("");
                    }}
                  />
                  <Select
                    name="time"
                    value={time}
                    options={date ? selectOptions(filteredTickets) : []}
                    onChange={(event) => {
                      setTime(event.target.selectedOptions[0].value);
                      setTicketId(parseInt(event.target.selectedOptions[0].id));
                    }}
                  />
                  <Button
                    label="Записаться"
                    width="calc(100% - 115px)"
                    onClick={() => {
                      mutateMakeAppointment();
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      }
    }
  };

  return (
    <Layout>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "min(800px, 80%)",
        }}>
        <Steps activeStep={step} />
        <div style={{ width: "100%", height: "460px", paddingTop: "25px" }}>
          {currentStep()}
        </div>
      </div>
    </Layout>
  );
};

export default AppointmentPage;
