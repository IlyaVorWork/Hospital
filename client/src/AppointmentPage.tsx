import React, { useEffect, useState } from "react";
import Layout, { AccessTokenPayload } from "./Layout";
import Steps from "./stories/steps/Steps";
import Button from "./stories/button/Button";
import DualButton, { DualButtonProps } from "./stories/dualButton/DualButton";
import DualCancelButton from "./stories/dualButton/DualCancelButton";
import DoctorCard, { DoctorCardProps } from "./stories/doctorCard/DoctorCard";
import Input from "./stories/input/Input";
import Select, { SelectOption } from "./stories/select/Select";
import { useMutation } from "react-query";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Loading from "./stories/loading/Loading";
import DualTextCard from "./stories/dualTextCard/DualTextCard";
import InfoCard from "./stories/infoCard/InfoCard";

type step = 1 | 2 | 3;

type spec = {
  id: number;
  name: string;
  ticket_count: number;
};

type doctor = {
  id: number;
  last_name: string;
  first_name: string;
  second_name: string;
  id_spec: number;
  img_url: string;
  ticket_count: number;
};

type ticket = {
  date: Date;
  cabinet_number: number;
  time_id: number;
  time: string;
};

interface appointmentData {
  date: Date;
  cabinet_number: number;
  time_id: number;
}

const AppointmentPage = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["Access_token"]);

  const [specs, setSpecs] = useState<spec[]>();
  const [doctors, setDoctors] = useState<doctor[]>();
  const [tickets, setTickets] = useState<ticket[]>();

  const [step, setStep] = useState<step>(1);
  const [spec, setSpec] = useState<string>("");
  const [doctor, setDoctor] = useState<string>("");

  const [date, setDate] = useState<Date>();
  const [ticket, setTicket] = useState<number>(-1);
  const [selectedValue, setSelectedValue] = useState("");

  const getSpecializations = useMutation({
    mutationFn: () => {
      return axios({
        headers: { Authorization: cookies.Access_token },
        method: "get",
        url: "http://localhost:8080/appointment/specializations",
      });
    },
    onSuccess: (res) => {
      setSpecs(res.data["specializations"]);
    },
  });

  const getDoctors = useMutation({
    mutationFn: (specId: number) => {
      return axios({
        headers: { Authorization: cookies.Access_token },
        method: "get",
        url: `http://localhost:8080/appointment/doctors?id_spec=${specId}`,
      });
    },
    onSuccess: (res) => {
      setDoctors(res.data["doctors"]);
    },
  });

  const getTickets = useMutation({
    mutationFn: (doctorId: number) => {
      return axios({
        headers: { Authorization: cookies.Access_token },
        method: "get",
        url: `http://localhost:8080/appointment/tickets?id_doctor=${doctorId}`,
      });
    },
    onSuccess: (res) => {
      if (res.data["tickets"] !== null) {
        setTickets(
          res.data["tickets"].map((el: ticket, index: number) => ({
            ...el,
            id: index,
          }))
        );
      } else {
        setTickets(res.data["tickets"]);
      }
    },
  });

  const makeAppointment = useMutation({
    mutationFn: (appointment: appointmentData) => {
      return axios({
        headers: { Authorization: cookies.Access_token },
        method: "post",
        url: "http://localhost:8080/appointment/makeAppointment",
        data: appointment,
      });
    },
    onSuccess: () => {
      navigate("/profile");
    },
  });

  useEffect(() => {
    getSpecializations.mutate();
  }, []);

  const selectOptions = (tickets: ticket[], date: Date) => {
    let filteredTickets = tickets.filter(
      (el) => new Date(el.date).getTime() === date.getTime()
    );
    let options = filteredTickets.map((el, index) => {
      let option: SelectOption = { id: index, value: el.time };
      return option;
    });

    return options;
  };

  const currentStep = () => {
    switch (step) {
      case 1: {
        if (getSpecializations.isLoading) {
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
                    setSpec(spec.name);
                    getDoctors.mutate(spec.id);
                    setStep(2);
                  }}
                />
              );
            })}
          </div>
        );
      }
      case 2: {
        if (getDoctors.isLoading) {
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
              choice={spec}
              onClick={() => {
                setSpec("");
                setStep(1);
              }}
            />
            {doctors == null ? (
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
                {doctors.map(
                  ({
                    id,
                    last_name,
                    first_name,
                    second_name,
                    ticket_count,
                    img_url,
                  }) => {
                    return (
                      <DoctorCard
                        key={id}
                        id={id}
                        doctorName={
                          last_name +
                          " " +
                          first_name[0] +
                          ". " +
                          second_name[0] +
                          "."
                        }
                        ticketCount={ticket_count}
                        url={img_url}
                        onClick={() => {
                          setDoctor(
                            last_name +
                              " " +
                              first_name[0] +
                              ". " +
                              second_name[0] +
                              "."
                          );
                          getTickets.mutate(id);
                          setStep(3);
                        }}
                      />
                    );
                  }
                )}
              </div>
            )}
          </div>
        );
      }
      case 3: {
        if (getTickets.isLoading) {
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
                choice={spec}
                onClick={() => {
                  setSpec("");
                  setDoctor("");
                  setStep(1);
                }}
              />
              <DualCancelButton
                choice={doctor}
                onClick={() => {
                  setDoctor("");
                  setStep(2);
                }}
              />
              {tickets == null ? (
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
                      setSelectedValue("");
                    }}
                  />
                  <Select
                    name="time"
                    value={selectedValue}
                    options={date ? selectOptions(tickets, date) : []}
                    onChange={(event) => {
                      setSelectedValue(event.target.selectedOptions[0].value);
                      setTicket(parseInt(event.target.selectedOptions[0].id));
                    }}
                  />
                  <Button
                    label="Записаться"
                    width="calc(100% - 115px)"
                    onClick={() => {
                      makeAppointment.mutate({
                        date: tickets[ticket].date,
                        cabinet_number: tickets[ticket].cabinet_number,
                        time_id: tickets[ticket].time_id,
                      });
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
