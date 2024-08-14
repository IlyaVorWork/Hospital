import { useEffect, useState } from "react";
import Layout from "./Layout";
import Button from "./stories/button/Button";
import Select, { SelectOption } from "./stories/select/Select";
import { useMutation } from "react-query";
import axios from "axios";
import { useCookies } from "react-cookie";
import { doctor } from "./DoctorsPage";
import Input, { InputProps } from "./stories/input/Input";
import CheckboxList from "./stories/checkboxList/CheckboxList";
import { specialization } from "./CabinetsPage";
import { Store } from "react-notifications-component";
import InfoCard from "./stories/infoCard/InfoCard";

type action = "add" | "delete";

type time = {
  id: number;
  time: string;
};

type makeSchedule = {
  date: Date;
  specialization_id: number;
  doctor_id: number;
  time_ids: number[];
};

type getSchedule = {
  date: Date;
  doctor_id: number;
};

type getTimes = {
  date: Date;
  doctor_id: number;
  specialization_id: number;
};

type deleteSchedule = {
  date: Date;
  doctor_id: number;
  time_ids: number[];
};

const SchedulePage = () => {
  const [cookies] = useCookies(["Access_token"]);
  const [action, setAction] = useState<action>("add");

  const [specsList, setSpecs] = useState<specialization[]>([]);
  const [doctorsList, setDoctors] = useState<doctor[]>([]);
  const [timesList, setTimes] = useState<time[]>([]);

  const [selectedSpec, setSelectedSpec] = useState<string>("");
  const [selectedSpecId, setSelectedSpecId] = useState<number>(-1);

  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedDoctorId, setSelectedDoctorId] = useState<number>(-1);

  const [date, setDate] = useState<Date | "">("");

  const [checkedValues, setCheckedValues] = useState<number[]>([]);

  const getSpecializations = useMutation({
    mutationFn: () => {
      return axios({
        headers: { Authorization: cookies.Access_token },
        method: "get",
        url: "http://localhost:8080/specialization/getSpecs",
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
      setDoctors(res.data["doctors"] ? res.data["doctors"] : []);
    },
  });

  const getTimes = useMutation({
    mutationFn: (data: getTimes) => {
      return axios({
        headers: { Authorization: cookies.Access_token },
        method: "post",
        url: "http://localhost:8080/appointment/getFreeTimes",
        data: data,
      });
    },
    onSuccess: (res) => {
      setTimes(res.data["times"] ? res.data["times"] : []);
    },
  });

  const makeSchedule = useMutation({
    mutationFn: (data: makeSchedule) => {
      return axios({
        headers: { Authorization: cookies.Access_token },
        method: "post",
        url: "http://localhost:8080/appointment/makeSchedule",
        data: data,
      });
    },
    onSuccess: () => {
      Store.addNotification({
        title: "Успех",
        message: "Расписание было успешно составлено",
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
      setTimes([]);
      setDoctors([]);
      setCheckedValues([]);
      setDate("");
      setSelectedDoctor("");
      setSelectedDoctorId(-1);
      setSelectedSpec("");
      setSelectedSpecId(-1);
    },
    onError: () => {
      console.log("Ошибка");
      // TODO Обработать ошибки создания расписания
    },
  });

  const getSchedule = useMutation({
    mutationFn: (data: getSchedule) => {
      return axios({
        headers: { Authorization: cookies.Access_token },
        method: "post",
        url: "http://localhost:8080/appointment/getSchedule",
        data: data,
      });
    },
    onSuccess: (res) => {
      setTimes(res.data["times"] ? res.data["times"] : []);
    },
  });

  const deleteSchedule = useMutation({
    mutationFn: (data: deleteSchedule) => {
      return axios({
        headers: { Authorization: cookies.Access_token },
        method: "delete",
        url: "http://localhost:8080/appointment/deleteSchedule",
        data: data,
      });
    },
    onSuccess: () => {
      Store.addNotification({
        title: "Успех",
        message: "Расписание было успешно удалено",
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
      setTimes([]);
      setDoctors([]);
      setCheckedValues([]);
      setDate("");
      setSelectedDoctor("");
      setSelectedDoctorId(-1);
      setSelectedSpec("");
      setSelectedSpecId(-1);
    },
    onError: () => {
      console.log("Ошибка");
      // TODO Обработать ошибки удаления расписания
    },
  });

  const currentAction = () => {
    switch (action) {
      case "add":
        return (
          <>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                gap: "20px",
              }}>
              <div
                style={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}>
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
                    setSelectedSpecId(
                      parseInt(event.target.selectedOptions[0].id)
                    );
                    setSelectedSpec(event.target.selectedOptions[0].value);
                    getDoctors.mutate(
                      parseInt(event.target.selectedOptions[0].id)
                    );
                  }}
                />
                <Select
                  name="doctor"
                  value={selectedDoctor}
                  options={doctorsList.map((el) => {
                    let option: SelectOption = {
                      id: el.id,
                      value:
                        el.last_name +
                        " " +
                        el.first_name +
                        " " +
                        el.second_name,
                    };
                    return option;
                  })}
                  onChange={(event) => {
                    setSelectedDoctorId(
                      parseInt(event.target.selectedOptions[0].id)
                    );
                    setSelectedDoctor(event.target.selectedOptions[0].value);
                  }}
                />
                <Input
                  type="date"
                  value={date}
                  onChange={(event) => {
                    setDate(
                      event.target.value ? new Date(event.target.value) : ""
                    );
                  }}
                />
              </div>
              <div style={{ width: "50%" }}>
                {timesList.length !== 0 ? (
                  <CheckboxList
                    setValues={setCheckedValues}
                    checkedValues={checkedValues}
                    options={timesList.map((el) => {
                      let option: InputProps = {
                        value: el.id,
                        placeholder: el.time,
                      };
                      return option;
                    })}
                  />
                ) : (
                  <InfoCard
                    type="big"
                    text="Выберите все данные для отображения доступных временных промежутков"
                  />
                )}
              </div>
            </div>
            <Button
              label="Добавить"
              onClick={() =>
                makeSchedule.mutate({
                  date: date,
                  specialization_id: selectedSpecId,
                  doctor_id: selectedDoctorId,
                  time_ids: checkedValues,
                } as makeSchedule)
              }
            />
          </>
        );
      case "delete":
        return (
          <>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                gap: "20px",
              }}>
              <div
                style={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}>
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
                    setSelectedSpecId(
                      parseInt(event.target.selectedOptions[0].id)
                    );
                    setSelectedSpec(event.target.selectedOptions[0].value);
                    getDoctors.mutate(
                      parseInt(event.target.selectedOptions[0].id)
                    );
                  }}
                />
                <Select
                  name="doctor"
                  value={selectedDoctor}
                  options={doctorsList.map((el) => {
                    let option: SelectOption = {
                      id: el.id,
                      value:
                        el.last_name +
                        " " +
                        el.first_name +
                        " " +
                        el.second_name,
                    };
                    return option;
                  })}
                  onChange={(event) => {
                    setSelectedDoctorId(
                      parseInt(event.target.selectedOptions[0].id)
                    );
                    setSelectedDoctor(event.target.selectedOptions[0].value);
                  }}
                />
                <Input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(new Date(event.target.value))}
                />
              </div>
              <div style={{ width: "50%" }}>
                {timesList.length !== 0 ? (
                  <CheckboxList
                    setValues={setCheckedValues}
                    checkedValues={checkedValues}
                    options={timesList.map((el) => {
                      let option: InputProps = {
                        value: el.id,
                        placeholder: el.time,
                      };
                      return option;
                    })}
                  />
                ) : (
                  <InfoCard
                    type="big"
                    text="Выберите все данные для отображения доступных временных промежутков"
                  />
                )}
              </div>
            </div>
            <Button
              label="Удалить"
              onClick={() =>
                deleteSchedule.mutate({
                  date: date,
                  doctor_id: selectedDoctorId,
                  time_ids: checkedValues,
                } as deleteSchedule)
              }
            />
          </>
        );
    }
  };

  useEffect(() => {
    getSpecializations.mutate();
    switch (action) {
      case "add":
        setSelectedSpec("");
        setSelectedSpecId(-1);
        setSelectedDoctor("");
        setSelectedDoctorId(-1);
        setDoctors([]);
        setDate("");
        setTimes([]);
        break;
      case "delete":
        setSelectedSpec("");
        setSelectedSpecId(-1);
        setSelectedDoctor("");
        setSelectedDoctorId(-1);
        setDoctors([]);
        setDate("");
        setTimes([]);
        break;
    }
  }, [action]);

  useEffect(() => {
    switch (action) {
      case "add":
        if (date && selectedDoctorId) {
          getTimes.mutate({
            date: date,
            doctor_id: selectedDoctorId,
            specialization_id: selectedSpecId,
          });
        }
        break;
      case "delete":
        if (date && selectedDoctorId) {
          getSchedule.mutate({ date: date, doctor_id: selectedDoctorId });
        }
        break;
    }
  }, [date, selectedDoctorId]);

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
            width="50%"
            active={action === "add" ? true : false}
            onClick={() => setAction("add")}
          />
          <Button
            label="Удалить"
            width="50%"
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

export default SchedulePage;
