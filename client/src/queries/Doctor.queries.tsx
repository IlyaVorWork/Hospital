import axios, { AxiosError, AxiosResponse } from "axios";
import { AddDoctorData, EditDoctorData } from "../types/Doctor.types";
import { CallErrorNotification } from "../utils/NotificationCall";
import { ErrorRes } from "../types/Auth.types";

export const GetDoctorsMutation = (
  token: string,
  onSuccess: (
    data: AxiosResponse<any, any>,
    variables: void,
    context: unknown
  ) => Promise<unknown> | void
) => {
  return {
    mutationFn: () => {
      return axios({
        headers: { Authorization: token },
        method: "get",
        url: "http://localhost:8080/doctor/getDoctors",
      });
    },
    onSuccess: onSuccess,
  };
};

export const GetDoctorsBySpecializationIdMutation = (
  token: string,
  specId: number,
  onSuccess: (
    data: AxiosResponse<any, any>,
    variables: void,
    context: unknown
  ) => Promise<unknown> | void
) => {
  return {
    mutationFn: () => {
      return axios({
        headers: { Authorization: token },
        method: "get",
        url: `http://localhost:8080/doctor/getDoctorsBySpecializationId?spec_id=${specId}`,
      });
    },
    onSuccess: onSuccess,
  };
};

export const AddDoctorMutation = (
  token: string,
  data: AddDoctorData,
  onSuccess: (
    data: AxiosResponse<any, any>,
    variables: void,
    context: unknown
  ) => Promise<unknown> | void
) => {
  return {
    mutationFn: () => {
      return axios({
        headers: { Authorization: token },
        method: "post",
        url: "http://localhost:8080/doctor/addDoctor",
        data: data,
      });
    },
    onSuccess: onSuccess,
    onError: (error: AxiosError) => {
      let err: ErrorRes = error.response?.data as ErrorRes;
      CallErrorNotification(err.error[0].toUpperCase() + err.error.slice(1));
    },
  };
};

export const EditDoctorMutation = (
  token: string,
  data: EditDoctorData,
  onSuccess: (
    data: AxiosResponse<any, any>,
    variables: void,
    context: unknown
  ) => Promise<unknown> | void
) => {
  return {
    mutationFn: () => {
      return axios({
        headers: { Authorization: token },
        method: "patch",
        url: "http://localhost:8080/doctor/editDoctor",
        data: data,
      });
    },
    onSuccess: onSuccess,
    onError: (error: AxiosError) => {
      let err: ErrorRes = error.response?.data as ErrorRes;
      CallErrorNotification(err.error[0].toUpperCase() + err.error.slice(1));
    },
  };
};

export const DeleteDoctorMutation = (
  token: string,
  doctorId: number,
  onSuccess: (
    data: AxiosResponse<any, any>,
    variables: void,
    context: unknown
  ) => Promise<unknown> | void
) => {
  return {
    mutationFn: () => {
      return axios({
        headers: { Authorization: token },
        method: "delete",
        url: "http://localhost:8080/doctor/deleteDoctor",
        data: { id: doctorId },
      });
    },
    onSuccess: onSuccess,
    onError: (error: AxiosError) => {
      let err: ErrorRes = error.response?.data as ErrorRes;
      CallErrorNotification(err.error[0].toUpperCase() + err.error.slice(1));
    },
  };
};
