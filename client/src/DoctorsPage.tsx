import { ChangeEvent, useEffect, useState } from "react";
import Layout from "./Layout";
import Button from "./stories/button/Button";
import { action, specialization } from "./CabinetsPage";
import Input from "./stories/input/Input";
import Select, { SelectOption } from "./stories/select/Select";
import { useMutation } from "react-query";
import axios, { AxiosError } from "axios";
import { useCookies } from "react-cookie";
import { Store } from "react-notifications-component";
import { Error } from "./LoginPage";

export type doctor = {
  id: number;
  last_name: string;
  first_name: string;
  second_name: string;
  id_specialization: number;
  img_url: string;
};

type addDoctorData = {
  last_name: string;
  first_name: string;
  second_name: string;
  id_specialization: number;
  img_url: string;
};

type editDoctorData = {
  id: number;
  last_name: string;
  first_name: string;
  second_name: string;
  img_url: string;
};

const DoctorsPage = () => {
  const [cookies] = useCookies(["Access_token"]);
  const [action, setAction] = useState<action>("add");

  const [specsList, setSpecs] = useState<specialization[]>([]);
  const [doctorsList, setDoctors] = useState<doctor[]>([]);

  const [fullName, setFullName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  const [selectedSpec, setSelectedSpec] = useState<string>("");
  const [selectedSpecId, setSelectedSpecId] = useState<number>(-1);

  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedDoctorId, setSelectedDoctorId] = useState<number>(-1);

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
    mutationFn: () => {
      return axios({
        headers: { Authorization: cookies.Access_token },
        method: "get",
        url: "http://localhost:8080/doctor/getDoctors",
      });
    },
    onSuccess: (res) => {
      setDoctors(res.data["doctors"]);
    },
  });

  const addDoctor = useMutation({
    mutationFn: (data: addDoctorData) => {
      return axios({
        headers: { Authorization: cookies.Access_token },
        method: "post",
        url: "http://localhost:8080/doctor/addDoctor",
        data: data,
      });
    },
    onSuccess: () => {
      Store.addNotification({
        title: "Успех",
        message: "Информация о враче была успешно добавлена",
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
      setFullName("");
      setAvatarUrl("");
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

  const editDoctor = useMutation({
    mutationFn: (data: editDoctorData) => {
      return axios({
        headers: { Authorization: cookies.Access_token },
        method: "patch",
        url: "http://localhost:8080/doctor/editDoctor",
        data: data,
      });
    },
    onSuccess: () => {
      Store.addNotification({
        title: "Успех",
        message: "Информация о враче была успешно изменена",
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
      setSelectedDoctor("");
      setSelectedDoctorId(-1);
      setFullName("");
      setAvatarUrl("");
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

  const deleteDoctor = useMutation({
    mutationFn: (id: number) => {
      return axios({
        headers: { Authorization: cookies.Access_token },
        method: "delete",
        url: "http://localhost:8080/doctor/deleteDoctor",
        data: { id: id },
      });
    },
    onSuccess: () => {
      Store.addNotification({
        title: "Успех",
        message: "Доктор был успешно удалён",
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
      setDoctors(doctorsList.filter((el) => el.id !== selectedDoctorId));
      setSelectedDoctor("");
      setSelectedDoctorId(-1);
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
        setFullName("");
        setAvatarUrl("");
        setSelectedSpec("");
        setSelectedSpecId(-1);
        setSelectedDoctor("");
        setSelectedDoctorId(-1);
        getSpecializations.mutate();
        break;
      case "edit":
        setFullName("");
        setAvatarUrl("");
        setSelectedSpec("");
        setSelectedSpecId(-1);
        setSelectedDoctor("");
        setSelectedDoctorId(-1);
        getDoctors.mutate();
        break;
      case "delete":
        setFullName("");
        setAvatarUrl("");
        setSelectedSpec("");
        setSelectedSpecId(-1);
        setSelectedDoctor("");
        setSelectedDoctorId(-1);
        getDoctors.mutate();
        break;
    }
  }, [action]);

  const currentAction = () => {
    switch (action) {
      case "add":
        return (
          <>
            <Input
              placeholder={"Введите ФИО"}
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
            <Input
              placeholder={"Введите ссылку на фото"}
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
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
                let [last, first, second] = fullName.split(" ");
                console.log(last, first, second);
                addDoctor.mutate({
                  last_name: last,
                  first_name: first,
                  second_name: second,
                  img_url: avatarUrl,
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
              name="doctor"
              value={selectedDoctor}
              options={doctorsList.map((el) => {
                let option: SelectOption = {
                  id: el.id,
                  value:
                    el.last_name + " " + el.first_name + " " + el.second_name,
                };
                return option;
              })}
              onChange={(event) => {
                setSelectedDoctorId(
                  parseInt(event.target.selectedOptions[0].id)
                );
                setSelectedDoctor(event.target.selectedOptions[0].value);
                setFullName(event.target.selectedOptions[0].value);
                console.log(parseInt(event.target.selectedOptions[0].id));
                setAvatarUrl(
                  doctorsList.find(
                    (el) =>
                      el.id === parseInt(event.target.selectedOptions[0].id)
                  )!.img_url
                );
              }}
            />
            {selectedDoctor ? (
              <>
                <Input
                  placeholder={"Введите ФИО"}
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                />
                <Input
                  placeholder={"Введите ссылку на фото"}
                  value={avatarUrl}
                  onChange={(event) => setAvatarUrl(event.target.value)}
                />
                <Button
                  label="Изменить"
                  onClick={() => {
                    let [last, first, second] = fullName.split(" ");
                    editDoctor.mutate({
                      id: selectedDoctorId,
                      last_name: last,
                      first_name: first,
                      second_name: second,
                      img_url: avatarUrl,
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
              name="doctor"
              value={selectedDoctor}
              options={doctorsList.map((el) => {
                let option: SelectOption = {
                  id: el.id,
                  value:
                    el.last_name + " " + el.first_name + " " + el.second_name,
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
            <Button
              label="Удалить"
              onClick={() => {
                deleteDoctor.mutate(selectedDoctorId);
              }}
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

export default DoctorsPage;
