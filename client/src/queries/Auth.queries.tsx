import axios, { AxiosError, AxiosResponse } from "axios";
import { ErrorRes, LoginData, RegisterPatientForm } from "../types/Auth.types";
import { CallErrorNotification } from "../utils/NotificationCall";

export const LoginUserMutation = (
  data: LoginData,
  onSuccess: (
    data: AxiosResponse<any, any>,
    variables: void,
    context: unknown
  ) => Promise<unknown> | void
) => {
  return {
    mutationFn: () => {
      return axios({
        method: "post",
        url: "http://localhost:8080/auth/login",
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

export const RegisterPatientMutation = (
  token: string,
  data: RegisterPatientForm,
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
        url: "http://localhost:8080/auth/register",
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

export const ChangePasswordMutation = (
  token: string,
  newPassword: string,
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
        url: "http://localhost:8080/auth/changePassword",
        data: { password: newPassword },
      });
    },
    onSuccess: onSuccess,
    onError: (error: AxiosError) => {
      let err: ErrorRes = error.response?.data as ErrorRes;
      CallErrorNotification(err.error[0].toUpperCase() + err.error.slice(1));
    },
  };
};

export const GetPatientDataMutation = (
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
        url: "http://localhost:8080/auth/getPatientData",
      });
    },
    onSuccess: onSuccess,
  };
};

export const GetPatientsMutation = (
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
        url: "http://localhost:8080/auth/getPatients",
      });
    },
    onSuccess: onSuccess,
  };
};
