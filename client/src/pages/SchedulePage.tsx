import { useEffect, useState } from "react";
import Button from "../stories/button/Button";
import Select, { SelectOption } from "../stories/select/Select";
import { useMutation } from "react-query";
import { useCookies } from "react-cookie";
import Input from "../stories/input/Input";
import CheckboxList, {
  CheckboxListOptionProps,
} from "../stories/checkboxList/CheckboxList";
import InfoCard from "../stories/infoCard/InfoCard";
import { Specialization } from "../types/Data.types";
import { Doctor } from "../types/Doctor.types";
import { Time } from "../types/Schedule.types";
import { CallSuccessNotification } from "../utils/NotificationCall";
import { GetSpecializationsMutation } from "../queries/Data.queries";
import { GetDoctorsBySpecializationIdMutation } from "../queries/Doctor.queries";
import {
  DeleteScheduleMutation,
  GetFreeTimesMutation,
  GetScheduleMutation,
  MakeScheduleMutation,
} from "../queries/Schedule.queries";
import { getFullName } from "../utils/NameFormatting";
import Layout from "../stories/layout/Layout";

type Action = "add" | "delete";

const SchedulePage = () => {
  const [cookies] = useCookies(["Access_token"]);
  const [action, setAction] = useState<Action>("add");

  const [specs, setSpecs] = useState<Specialization[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [times, setTimes] = useState<Time[]>([]);

  const [spec, setSpec] = useState<Specialization>({ id: 0 } as Specialization);
  const [doctor, setDoctor] = useState<Doctor>({ id: 0 } as Doctor);

  const [date, setDate] = useState<Date | "">("");

  const [checkedTimes, setCheckedTimes] = useState<number[]>([]);

  const ClearForms = () => {
    setTimes([]);
    setDoctors([]);
    setCheckedTimes([]);
    setDate("");
    setDoctor({ id: 0 } as Doctor);
    setSpec({ id: 0 } as Specialization);
  };

  const { mutate: MutateGetSpecializations } = useMutation(
    GetSpecializationsMutation(cookies.Access_token, (res) => {
      setSpecs(res.data["specializations"] ? res.data["specializations"] : []);
    })
  );

  const { mutate: MutateGetDoctorsBySpecializationId } = useMutation(
    GetDoctorsBySpecializationIdMutation(
      cookies.Access_token,
      spec.id,
      (res) => {
        setDoctors(res.data["doctors"] ? res.data["doctors"] : []);
      }
    )
  );

  const { mutate: MutateGetFreeTimes } = useMutation(
    GetFreeTimesMutation(
      cookies.Access_token,
      {
        date: date as Date,
        doctor_id: doctor.id,
        specialization_id: spec.id,
      },
      (res) => {
        setTimes(res.data["times"] ? res.data["times"] : []);
      }
    )
  );

  const { mutate: MutateMakeSchedule } = useMutation(
    MakeScheduleMutation(
      cookies.Access_token,
      {
        date: date as Date,
        specialization_id: spec.id,
        doctor_id: doctor.id,
        time_ids: checkedTimes,
      },
      () => {
        CallSuccessNotification("Расписание было успешно составлено");
        ClearForms();
      }
    )
  );

  const { mutate: MutateGetSchedule } = useMutation(
    GetScheduleMutation(
      cookies.Access_token,
      { date: date as Date, doctor_id: doctor.id },
      (res) => {
        setTimes(res.data["times"] ? res.data["times"] : []);
      }
    )
  );

  const { mutate: MutateDeleteSchedule } = useMutation(
    DeleteScheduleMutation(
      cookies.Access_token,
      {
        date: date as Date,
        doctor_id: doctor.id,
        time_ids: checkedTimes,
      },
      () => {
        CallSuccessNotification("Расписание было успешно удалено");
        ClearForms();
      }
    )
  );

  useEffect(() => {
    MutateGetSpecializations();
    switch (action) {
      case "add":
        ClearForms();
        break;
      case "delete":
        ClearForms();
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);

  useEffect(() => {
    if (spec.id) {
      MutateGetDoctorsBySpecializationId();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec]);

  useEffect(() => {
    switch (action) {
      case "add":
        if (date && doctor.id) {
          MutateGetFreeTimes();
        }
        break;
      case "delete":
        if (date && doctor.id) {
          MutateGetSchedule();
        }
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, doctor]);

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
                  value={spec.id ? spec.name : ""}
                  options={specs.map((el) => {
                    let option: SelectOption = {
                      id: el.id,
                      value: el.name,
                    };
                    return option;
                  })}
                  onChange={(event) =>
                    setSpec(
                      specs.find(
                        (el) =>
                          el.id === parseInt(event.target.selectedOptions[0].id)
                      )!
                    )
                  }
                />
                <Select
                  name="doctor"
                  value={doctor.id ? getFullName(doctor) : ""}
                  options={doctors.map((el) => {
                    let option: SelectOption = {
                      id: el.id,
                      value: getFullName(el),
                    };
                    return option;
                  })}
                  onChange={(event) =>
                    setDoctor(
                      doctors.find(
                        (el) =>
                          el.id === parseInt(event.target.selectedOptions[0].id)
                      )!
                    )
                  }
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
                {times.length !== 0 ? (
                  <CheckboxList
                    setValues={setCheckedTimes}
                    checkedValues={checkedTimes}
                    options={times.map((el) => {
                      let option: CheckboxListOptionProps = {
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
              disabled={
                spec.id && doctor.id && date && checkedTimes.length > 0
                  ? false
                  : true
              }
              onClick={() => MutateMakeSchedule()}
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
                  value={spec.id ? spec.name : ""}
                  options={specs.map((el) => {
                    let option: SelectOption = {
                      id: el.id,
                      value: el.name,
                    };
                    return option;
                  })}
                  onChange={(event) =>
                    setSpec(
                      specs.find(
                        (el) =>
                          el.id === parseInt(event.target.selectedOptions[0].id)
                      )!
                    )
                  }
                />
                <Select
                  name="doctor"
                  value={doctor.id ? getFullName(doctor) : ""}
                  options={doctors.map((el) => {
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
                  onChange={(event) =>
                    setDoctor(
                      doctors.find(
                        (el) =>
                          el.id === parseInt(event.target.selectedOptions[0].id)
                      )!
                    )
                  }
                />
                <Input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(new Date(event.target.value))}
                />
              </div>
              <div style={{ width: "50%" }}>
                {times.length !== 0 ? (
                  <CheckboxList
                    setValues={setCheckedTimes}
                    checkedValues={checkedTimes}
                    options={times.map((el) => {
                      let option: CheckboxListOptionProps = {
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
              disabled={
                spec.id && doctor.id && date && checkedTimes.length > 0
                  ? false
                  : true
              }
              onClick={() => MutateDeleteSchedule()}
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
