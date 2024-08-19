import axios, { AxiosError, AxiosResponse } from "axios";
import { UseMutationOptions } from "react-query";
import { AppointmentData } from "../types/Appointment.types";
import { CallErrorNotification } from "../utils/NotificationCall";
import { ErrorRes } from "../types/Auth.types";

export const GetFreeAppointmentsMutation = (
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
        method: "get",
        url: `http://localhost:8080/appointment/getFreeAppointments?doctor_id=${doctorId}`,
      });
    },
    onSuccess: onSuccess,
  };
};

export const MakeAppointmentMutation = (
  token: string,
  data: AppointmentData,
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
        url: "http://localhost:8080/appointment/makeAppointment",
        data: data,
      });
    },
    onSuccess: onSuccess,
  } as UseMutationOptions<AxiosResponse<any, any>, unknown, void, unknown>;
};

export const GetAppointmentsByPatientIdMutation = (
  token: string,
  patientId: number,
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
        url: `http://localhost:8080/appointment/getAppointmentsByPatientId?patient_id=${patientId}`,
      });
    },
    onSuccess: onSuccess,
  };
};

export const CancelAppointmentMutation = (
  token: string,
  data: AppointmentData,
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
        url: "http://localhost:8080/appointment/cancelAppointment",
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
