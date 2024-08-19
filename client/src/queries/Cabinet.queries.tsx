import axios, { AxiosError, AxiosResponse } from "axios";
import {
  CallErrorNotification,
  CallSuccessNotification,
} from "../utils/NotificationCall";
import { ErrorRes } from "../types/Auth.types";
import { Cabinet } from "../types/Cabinet.types";

export const GetCabinetsMutation = (
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
        url: "http://localhost:8080/cabinet/getCabinets",
      });
    },
    onSuccess: onSuccess,
  };
};

export const AddCabinetMutation = (
  token: string,
  cabinet: Cabinet,
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
        url: "http://localhost:8080/cabinet/addCabinet",
        data: cabinet,
      });
    },
    onSuccess: onSuccess,
    onError: (error: AxiosError) => {
      let err: ErrorRes = error.response?.data as ErrorRes;
      CallErrorNotification(err.error[0].toUpperCase() + err.error.slice(1));
    },
  };
};

export const EditCabinetMutation = (
  token: string,
  cabinet: Cabinet,
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
        url: "http://localhost:8080/cabinet/editCabinet",
        data: cabinet,
      });
    },
    onSuccess: onSuccess,
    onError: (error: AxiosError) => {
      let err: ErrorRes = error.response?.data as ErrorRes;
      CallErrorNotification(err.error[0].toUpperCase() + err.error.slice(1));
    },
  };
};

export const DeleteCabinetMutation = (
  token: string,
  cabinetNumber: number,
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
        url: "http://localhost:8080/cabinet/deleteCabinet",
        data: { number: cabinetNumber },
      });
    },
    onSuccess: onSuccess,
    onError: (error: AxiosError) => {
      let err: ErrorRes = error.response?.data as ErrorRes;
      CallErrorNotification(err.error[0].toUpperCase() + err.error.slice(1));
    },
  };
};
