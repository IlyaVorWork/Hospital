import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import Steps from "./stories/steps/Steps";
import Button from "./stories/button/Button";
import DualButton, { DualButtonProps } from "./stories/dualButton/DualButton";
import DualCancelButton from "./stories/dualButton/DualCancelButton";
import DoctorCard, { DoctorCardProps } from "./stories/doctorCard/DoctorCard";
import Input from "./stories/input/Input";
import Select from "./stories/select/Select";

type step = 1 | 2 | 3;

const stepOneFakeData: DualButtonProps[] = [
  { specialization: "Кардиолог", ticketCount: 5 },
  { specialization: "Отоларинголог", ticketCount: 12 },
  { specialization: "Терапевт", ticketCount: 16 },
  { specialization: "Психиатр", ticketCount: 7 },
  { specialization: "Офтальмолог", ticketCount: 8 },
];

const stepTwoFakeData: DoctorCardProps[] = [
  {
    id: 1,
    doctorName: "Гавриилов И.О.",
    ticketCount: 5,
    url: "https://i.ibb.co/FmyRhkh/Doctor5.jpg",
  },
  {
    id: 2,
    doctorName: "Гавриилов И.О.",
    ticketCount: 5,
    url: "https://i.ibb.co/FmyRhkh/Doctor5.jpg",
  },
  {
    id: 3,
    doctorName: "Гавриилов И.О.",
    ticketCount: 5,
    url: "https://i.ibb.co/FmyRhkh/Doctor5.jpg",
  },
];

const stepThreeFakeData = [
  {
    id: 1,
    value: "16:00 - 16:15",
  },
  {
    id: 2,
    value: "16:15 - 16:30",
  },
  {
    id: 3,
    value: "16:30 - 16:45",
  },
];

const AssignPage = () => {
  const [step, setStep] = useState<step>(1);
  const [spec, setSpec] = useState<string>("");
  const [doctor, setDoctor] = useState<string>("");
  const [doctorId, setDoctorId] = useState<number>(-1);
  const [date, setDate] = useState<Date>();

  const currentStep = () => {
    switch (step) {
      case 1:
        return (
          <div
            style={{
              marginTop: "25px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}>
            {stepOneFakeData.map((spec) => {
              return (
                <DualButton
                  specialization={spec.specialization}
                  ticketCount={spec.ticketCount}
                  onClick={() => {
                    setSpec(spec.specialization);
                    setStep(2);
                  }}
                />
              );
            })}
          </div>
        );
      case 2:
        return (
          <div
            style={{
              marginTop: "25px",
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
                  setStep(1);
                }}
              />
              <div
                style={{ display: "flex", flexDirection: "row", gap: "25px" }}>
                {stepTwoFakeData.map(({ id, doctorName, ticketCount, url }) => {
                  return (
                    <DoctorCard
                      id={id}
                      doctorName={doctorName}
                      ticketCount={ticketCount}
                      url={url}
                      onClick={() => {
                        setDoctor(doctorName);
                        setDoctorId(id);
                        setStep(3);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div
            style={{
              marginTop: "25px",
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
                  setDoctorId(-1);
                  setStep(1);
                }}
              />
              <DualCancelButton
                choice={doctor}
                onClick={() => {
                  setDoctor("");
                  setDoctorId(-1);
                  setStep(2);
                }}
              />
              <div
                style={{ display: "flex", flexDirection: "row", gap: "25px" }}>
                <Input
                  type="date"
                  value={date}
                  onChange={(event) => {
                    setDate(new Date(event.target.value));
                  }}
                />
                <Select name="time" options={stepThreeFakeData} />
                <Button label="Записаться" width="calc(100% - 115px)" />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div>
        <Steps activeStep={step} />
        {currentStep()}
      </div>
    </Layout>
  );
};

export default AssignPage;
